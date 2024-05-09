import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler: Handler = async (event, context) => {
    const key = event.queryStringParameters.key;
    const bucketName = event.queryStringParameters.bucketName;

    const headers = {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Credentials': true,
    }

    if (process.env.DISALLOWED_BUCKETS !== undefined && process.env.DISALLOWED_BUCKETS.split(',').includes(bucketName)) {
        console.log('User cannot be asset bucket');
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify('Bad User'),
        }
    }

    // create bucket if it doesn't exist
    const s3 = new AWS.S3();
    console.log(bucketName)
    try {
        await s3.createBucket({
            Bucket: bucketName,
        }).promise();
    } catch (err) {
        console.log(err);
    }

    await s3.putBucketCors({
        Bucket: bucketName,
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ["*"],
                    AllowedMethods: ["PUT", "POST", "DELETE"],
                    AllowedOrigins: [process.env.CORS_ORIGIN || '*'],
                }
            ]
        }
    }).promise();

    var url = await new AWS.S3({
        signatureVersion: 'v4',
    }).getSignedUrlPromise('putObject', {
        Bucket: bucketName,
        Key: key,
        ContentType: 'text/plain'
    });
    if (url) {
        console.log(`Generated URL: ${url}`);
    } else {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify('Bad Request'),
        };
    }
    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
            url: url,
        }),
    };
}