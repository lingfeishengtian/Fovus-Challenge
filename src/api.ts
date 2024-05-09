import * as fs from "fs";
import * as AWS from 'aws-sdk';
import { url } from "inspector";

const s3 = new AWS.S3();

const USER_PREFIX = 'fovuschal-backendstack-'
// randomly generated ID for this particular frontend instance, it can be freely changed to anything
const CURRENT_INSTANCE_ID = 'i-1389nF0WDj-'

const generateBucketNameFromUser = (user: string) => {
    return `${USER_PREFIX}${CURRENT_INSTANCE_ID}${user}`.toLowerCase();
}

const uploadFileToS3 = async (file: File, user: string) => {
    const PresignedUrlEndpoint = process.env.REACT_APP_PresignedUrlEndpoint;
    console.log(generateBucketNameFromUser(user))
    const urlResp = await fetch(`${PresignedUrlEndpoint}?key=${file.name}&bucketName=${generateBucketNameFromUser(user)}`);
    const urlRespJson = await urlResp.json();

    // check if url is valid
    if ('url' in urlRespJson) {
        const url = urlRespJson.url;
        const formData = new FormData();
        formData.append('file', file);
        const uploadResp = await fetch(url, {
            method: 'PUT',
            headers: {
                contentType: 'application/octet-stream'
            },
            body: formData,
        });

        const result = await uploadResp.text();
        console.log(result)
        return result;
    } else {
        throw new Error('Invalid user');
    }
}

const submitFile = async (file: File, user: string, inputText: string) => {
    const SubmitFileEndpoint = process.env.REACT_APP_SubmitFileEndpoint;
    if (!SubmitFileEndpoint) {
        throw new Error('SubmitFileEndpoint not set');
    }
    const submitResp = await fetch(SubmitFileEndpoint, {
        method: 'POST',
        body: JSON.stringify({
            file: file.name,
            user: generateBucketNameFromUser(user),
            inputText: inputText,
        }),
    });

    const result = await submitResp.text();
    return result;
}

export { uploadFileToS3, submitFile };