# Fovus Challenge

The project is hosted completely on Amazon Web Services (AWS), utilizing DynamoDB, Lambda, and API Gateway. In addition, Amplify is used to host the frontend (automatically build on every github push), but Amplify resources are not used in this project. TailwindCSS is used for styling the frontend and responsive UI design.

## Getting Started

After pulling the directory, you may ignore the frontend directory. Set the current directory to the backend folder with the following command:

```bash
cd backend
```

In order to prevent hard coding, please initialize your aws credentials with the following command:

```bash
aws configure
```

Install the necessary node modules with the following command:

```bash
npm install
```

Next, the environment needs to be bootstraped. This can be done with the following command:

```bash
cdk bootstrap
```

The project uses Github in order to manage the frontend. (Which is also why there is a frontend_only branch). Therefore, the github access token needs to be stored in AWS Secrets Manager. If these credentials are not set, the stack will be unable to be deployed and produce an "internal error". Go to the following link: [Here](https://github.com/settings/tokens) and create a token that has the admin:public_key, admin:repo_hook, admin:ssh_signing_key, repo, workflow permissions.

Then run following command will store the token:

```bash
aws secretsmanager create-secret --name github-access-token --secret-string <token>
```

After the environment is bootstrapped and Github token has been set, the stack can be deployed with the following command:

```bash
cdk deploy
```

Finally, to test the project, go to your AWS Amplify page and find the deployment link for the "frontend" application.

## References

[Loading Animation](https://play.tailwindcss.com/iD2XjOz2rp)
[TailwindCSS Setup](https://tailwindcss.com/docs/installation)
[Amazon CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
[Amazon SDK (For Lambda Code)](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)
[Amazon CDK Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
[Amazon Amplify Alpha Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-amplify-alpha-readme.html)
[Amazon Secrets (Storing Github Access Token for Amplify)](https://github.com/petedannemann/aws-secrets-manager-cli)
[CORS Issue Fix](https://stackoverflow.com/questions/20035101/why-does-my-javascript-code-receive-a-no-access-control-allow-origin-header-i)
[Autobuild with Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)
[DynamoDB Triggers](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources.DynamoEventSource.html)
[Manually Deploying Amplify](https://stackoverflow.com/questions/70358269/assets-execution-step-failing-in-codepipeline-cdk-java)