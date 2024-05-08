import { Duration, Stack, StackProps  } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'FileTable', { 
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }, 
      billingMode: dynamodb.BillingMode.PROVISIONED, 
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      readCapacity: 20,
      writeCapacity: 20,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      sortKey: {name: 'createdAt', type: dynamodb.AttributeType.NUMBER},
      pointInTimeRecovery: true,
      tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
    });

    console.log(table.tableArn);
  }
}
