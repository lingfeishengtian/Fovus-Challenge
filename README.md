# Fovus Challenge

**NOTE:** I FULLY SUPPORT THE USE OF THIS CODE TO HELP YOU THROUGH YOUR INTERVIEW PROCESS ♥️♥️

# Writeup on the Interview Process

For those who stumble upon this repository, I warn you to against continuing this project. The company's requirements for the interview process are not only absurd, but is purposely designed to trap students and gain free labor. 

This repository assisted me in passing through the first requirement (rather free labor) in the interview process. When I was able to talk to a human (his name was Jashmin I think) from the company, although I am not sure this person's role in the company, he was very kind and we had a nice conversation. However, he told me afterward that I would be recieving another technical interview which he told me to look out for (which not be held by him). (This was already quite sketchy since I did this whole project and they still want to test my technical skills?)

My next interview occurred about a week later. I was neither given a phone call or emailed, I happened to check my calendar app and noticed that the CTO of the company had scheduled a technical interview, the **same day** that it was supposed to happen. I happened to be free that day so I attended the interview. During the interview, the CTO was extremely rude and cut me off at every chance he had. The technical interview was that he told me to "code a school registration system". While he was telling me the prompt, he mentioned that "this normally takes a company 10 years to do", however he wanted me to complete it in 10 minutes. When I said, "alright, I'll code a small demo on what I would plan it to look like", he rudely interrupted me, interjecting that he "wanted working code". Obviously, I wasn't able to complete this daunting task, so he then called me "unqualified" while praising my project. (Contradictary eh?) He also talked about me "not getting the point", and when I asked him what that point was, he refused to tell me straightforward and mentioned something about including a "database design", which I did mention and comment in my code. However, when I tried to bring up the fact that I had talked about the points he vaguely referenced as "the point", he interrupted me and pretended it never happened.

I also asked him about why he scheduled an interview on the same day it was supposed to happen, and why I wasn't notified through email, text, or phone. He simply said that "it was the industry standard", which although I have not been in the "industry" before, I have heard people using software such as Slack.

He proceeded to then offer me an **unpaid** internship, for which I kindly explained that I had a job already, but was looking to advance my career in the Computer Science field. He interrupted me midway and said "ok then we're done" and ended the call.

Overall, if you are planning to apply, I warn you against future toxicity. There are many companies and you don't need to torture yourself in a company like Fovus.

# Description

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
