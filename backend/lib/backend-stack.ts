import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoTableTrigger } from './dynamo-table-trigger';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { FileAccept } from './file-accept';
import { PresignedUrl } from './presigned-url';
import * as aws_amplify_alpha from '@aws-cdk/aws-amplify-alpha';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Initialize the S3 bucket and deploy the scripts necessary for the EC2 instance
    const AssetBucket = new s3.Bucket(this, "AssetBucket", {
      publicReadAccess: false,
    });

    new s3deploy.BucketDeployment(this, "DeployFiles", {
      sources: [s3deploy.Source.asset("resources/scripts")],
      destinationBucket: AssetBucket,
    });

    // Initialize the DynamoDB table and trigger
    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new DynamoTableTrigger(this, 'DynamoTableTrigger', table, AssetBucket.bucketName);
    let fileAcceptEndpoint = new FileAccept(this, 'FileAccept', table.tableName, [AssetBucket.bucketName]);
    let presignedUrlEndpoint = new PresignedUrl(this, 'PresignedUrl', [AssetBucket.bucketName]);

    const frontend = new aws_amplify_alpha.App(this, 'Frontend', {
      sourceCodeProvider: new aws_amplify_alpha.GitHubSourceCodeProvider({
        owner: 'lingfeishengtian',
        repository: 'fovus-challenge',
        oauthToken: cdk.SecretValue.secretsManager('github-access-token'),
      }),
      autoBranchCreation: {
        patterns: ['*'],
        basicAuth: aws_amplify_alpha.BasicAuth.fromGeneratedPassword('username'),
      },
      autoBranchDeletion: true,
    });

    const frontend_only = frontend.addBranch('frontend_only',
      {
        autoBuild: true,
        stage: 'PRODUCTION',
        environmentVariables: {
          "REACT_APP_SubmitFileEndpoint": fileAcceptEndpoint.url,
          "REACT_APP_PresignedUrlEndpoint": presignedUrlEndpoint.url,
        },
      }
    );

    frontend.addEnvironment('REACT_APP_SubmitFileEndpoint', fileAcceptEndpoint.url);
    frontend.addEnvironment('REACT_APP_PresignedUrlEndpoint', presignedUrlEndpoint.url);

    // In production envriornment, set CORS to be the URL of the frontend
    fileAcceptEndpoint.setCORSEnv("*");
    presignedUrlEndpoint.setCORSEnv("*");

    const build_trigger = new cdk.custom_resources.AwsCustomResource(this, 'triggerAppBuild', {
      policy: cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cdk.custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE
      }),
      onCreate: {
        service: 'Amplify',
        action: 'startJob',
        physicalResourceId: cdk.custom_resources.PhysicalResourceId.of('app-build-trigger'),
        parameters: {
          appId: frontend.appId,
          branchName: frontend_only.branchName,
          jobType: 'RELEASE',
          jobReason: 'Auto Start build',
        }
      },
    });

  }
}
