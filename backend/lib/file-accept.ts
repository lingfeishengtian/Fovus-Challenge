import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from "constructs";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { PolicyStatement, Role, ServicePrincipal, InstanceProfile, ManagedPolicy } from "aws-cdk-lib/aws-iam";

export class FileAccept extends Construct {
    url: string;
    restFunc: NodejsFunction;

    constructor(scope: Construct, id: string, tableName: string, disallowedBuckets: string[] = []) {
        super(scope, id);
        const restFunc = new NodejsFunction(this, 'function');
        const apiEndpoint = new apigateway.LambdaRestApi(this, 'submitFile', {
            handler: restFunc,
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });
        restFunc.addEnvironment('TABLE_NAME', tableName);
        restFunc.addEnvironment('DISALLOWED_BUCKETS', disallowedBuckets.join(','));
        restFunc.addToRolePolicy(new PolicyStatement({
            actions: ['s3:HeadObject', 's3:GetObject', "dynamodb:PutItem", "dynamodb:GetItem"],
            resources: ['*'],
        }));
        
        this.restFunc = restFunc;
        this.url = apiEndpoint.url;
    }

    getURL() {
        return this.url;
    }

    setCORSEnv(webUrl: string) {
        this.restFunc.addEnvironment('CORS_ORIGIN', webUrl);
    }
}