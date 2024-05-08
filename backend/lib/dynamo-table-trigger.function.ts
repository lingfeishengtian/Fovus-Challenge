import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler: Handler = async (event, context) => {
    const ec2 = new AWS.EC2();

    console.log("Instance Profile: " + process.env.INSTANCE_PROFILE)
    ec2.runInstances({
        ImageId: 'ami-07caf09b362be10b8',
        InstanceType: 't2.micro',
        MinCount: 1,
        MaxCount: 1,
        UserData: Buffer.from(`#!/bin/bash
        aws s3 cp s3://${process.env.BUCKET_NAME}/vpcScript.sh /tmp/vpcScript.sh
        sudo chmod +x /tmp/vpcScript.sh
        cd /tmp; /tmp/vpcScript.sh
        `, 'utf8').toString('base64'),
        IamInstanceProfile: {
            Arn: process.env.INSTANCE_PROFILE
        },
        InstanceInitiatedShutdownBehavior: 'terminate',
    }, (err, data) => {
        if (err) {
            console.error(err, err.stack);
        }
        else {
            if (!data.Instances) {
                throw new Error('No instances were created');
            }
            console.log("Instance started: " + data.Instances[0].InstanceId);
        }
    }
    ).send();
    console.log("Instance started" );

    // if (!newInstance.Instances) {
    //     throw new Error('No instances were created');
    // }

    // if (newInstance.Instances.length !== 1) {
    //     for (const instance of newInstance.Instances) {
    //         console.log("Instance: " + instance.InstanceId);
    //     }
    //     ec2.stopInstances({
    //         InstanceIds: newInstance.Instances.map(instance => instance.InstanceId) as AWS.EC2.InstanceIdStringList
    //     }).promise();
    //     throw new Error('Unexpected number of instances created');
    // }

    // console.log("Instance started: " + newInstance.Instances[0].InstanceId);



    return context.logStreamName;
};