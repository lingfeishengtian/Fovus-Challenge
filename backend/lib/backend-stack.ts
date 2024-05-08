import { Duration, Stack, StackProps, } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoTableTrigger } from './dynamo-table-trigger';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { FileAccept } from './file-accept';

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
    new FileAccept(this, 'FileAccept', table.tableName, [AssetBucket.bucketName]);
  }
}
