import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from "constructs";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { PolicyStatement, Role, ServicePrincipal, InstanceProfile, ManagedPolicy } from "aws-cdk-lib/aws-iam";

export class DynamoTableTrigger extends Construct {
    constructor(scope: Construct, id: string, table: dynamodb.Table, bucketName: string) {
        super(scope, id);

        const dynamotablelambda = new NodejsFunction(this, 'function', {
            retryAttempts: 0,
        })

        dynamotablelambda.addToRolePolicy(new PolicyStatement({
            actions: ['ec2:RunInstances', 'ec2:StopInstances', 'iam:PassRole'],
            resources: ['*'],
        }));
        
        dynamotablelambda.addEventSource(new DynamoEventSource(table, {
          startingPosition: lambda.StartingPosition.LATEST,
          batchSize: 1,
          retryAttempts: 0,
        }))

        const role = new Role(this, 'role', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
        });

        role.addToPolicy(new PolicyStatement({
            actions: ['s3:GetObject', 'dynamodb:PutItem', 's3:PutObject'],
            resources: ['*'],
        }));

        const instanceProfile = new InstanceProfile(this, 'EC2S3AccesibleInstanceProfile', {
            role: role,
        });

        dynamotablelambda.addEnvironment('INSTANCE_PROFILE', instanceProfile.instanceProfileArn);
        dynamotablelambda.addEnvironment('BUCKET_NAME', bucketName);
        dynamotablelambda.addEnvironment('TABLE_NAME', table.tableName);
    }
}