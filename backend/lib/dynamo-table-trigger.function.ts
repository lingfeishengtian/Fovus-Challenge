import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler: Handler = async (event, context) => {
    const ec2 = new AWS.EC2();

    // Sometimes the DynamoDB stream will trigger the lambda function with the same event multiple times, prevent this by checking if the output_file_path exists
    if ('output_file_path' in event.Records[0].dynamodb.NewImage) {
        return context.logStreamName;
    }

    console.log("Instance Profile: " + process.env.INSTANCE_PROFILE)
    await ec2.runInstances({
        ImageId: 'ami-07caf09b362be10b8',
        InstanceType: 't2.micro',
        MinCount: 1,
        MaxCount: 1,
        UserData: Buffer.from(`#!/bin/bash
        aws s3 cp s3://${process.env.BUCKET_NAME}/vpcScript.sh /tmp/vpcScript.sh
        sudo chmod +x /tmp/vpcScript.sh
        cd /tmp; /tmp/vpcScript.sh "${event.Records[0].dynamodb.NewImage.input_file_path.S}" "${event.Records[0].dynamodb.NewImage.input_text.S}" "${event.Records[0].dynamodb.NewImage.id.S}" "${process.env.TABLE_NAME}"
        `, 'utf8').toString('base64'),
        IamInstanceProfile: {
            Arn: process.env.INSTANCE_PROFILE
        },
        InstanceInitiatedShutdownBehavior: 'terminate',
    }).promise();
    console.log("Instance started" );

    return context.logStreamName;
};