import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from "constructs";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { PolicyStatement, Role, ServicePrincipal, InstanceProfile, ManagedPolicy } from "aws-cdk-lib/aws-iam";

export class PresignedUrl extends Construct {
    url: string;

    constructor(scope: Construct, id: string, disallowedBuckets: string[] = []) {
        super(scope, id);
        const restFunc = new NodejsFunction(this, 'function');
        const apiEndpoint = new apigateway.LambdaRestApi(this, 'getPresignedUrl', {
            handler: restFunc,
        });

        restFunc.addEnvironment('DISALLOWED_BUCKETS', disallowedBuckets.join(','));
        restFunc.addToRolePolicy(new PolicyStatement({
            actions: ["s3:PutObject", "s3:GetObject", "s3:CreateBucket"],
            resources: ['*'],
        }));

        this.url = apiEndpoint.url;
    }

    getURL() {
        return this.url;
    }
}