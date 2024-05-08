import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

import { nanoid } from 'nanoid';

export const handler: Handler = async (event, context) => {
    console.log(event);
    const TableName = process.env.TABLE_NAME;
    if (!TableName) {
        throw new Error('Table name not set');
    }

    if (!('body' in event)) {
        return {
            statusCode: 400,
            body: JSON.stringify('Bad Request'),
        };
    }

    let body = JSON.parse(event.body);
    if ('file' in body && 'user' in body && 'inputText' in body) {
        // initialize user and file
        const user = body.user;
        const file = body.file;
        const inputText = body.inputText;

        // check user to ensure it isn't preassigned bucket
        if (process.env.DISALLOWED_BUCKETS !== undefined && process.env.DISALLOWED_BUCKETS.split(',').includes(user)) {
            console.log('User cannot be asset bucket');
            return {
                statusCode: 400,
                body: JSON.stringify('Bad User'),
            }
        }

        // check if the file exists
        const s3 = new AWS.S3();
        try {
            const exists = await s3.headObject({
                Bucket: user,
                Key: file,
            }).promise();
        } catch (err) {
            console.log(`File ${file} does not exist in bucket ${user}`);
            console.log(err);
            return {
                statusCode: 400,
                body: JSON.stringify('File was not uploaded'),
            }
        }

        // does user already have this file?
        const docClient = new AWS.DynamoDB.DocumentClient();

        try {
            await docClient.get({
                TableName: TableName,
                Key: {
                    user: user,
                    file: file,
                },
            }).promise();
            console.log(`User ${user} already has file ${file}`);
            return {
                statusCode: 400,
                body: JSON.stringify('File already exists'),
            }
        } catch (err) {
            console.log(`Pass: User ${user} does not have file ${file}`);
        }

        // add file to table
        await docClient.put({
            TableName: TableName,
            Item: {
                id: nanoid(),
                input_text: inputText,
                input_file_path: `${user}/${file}`,
            },
        }).promise();

        console.log(`Received file ${event.file} from user ${event.user}`);
        return {
            statusCode: 200,
            body: JSON.stringify('File accepted, processing...'),
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify('Bad Request'),
    };
};