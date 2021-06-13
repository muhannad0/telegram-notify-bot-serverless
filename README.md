# Serverless Telegram Bot on AWS

A NodeJS Telegram bot deployed using Pulumi.

## Frameworks Used

- [Telegraf Bot Framework](https://telegraf.js.org/)
- [Pulumi](https://pulumi.com/)

## Requirements

- Pulumi [configured](https://www.pulumi.com/docs/get-started/aws/).
- A [Telegram](https://telegram.org/) account.

## Installation

- Install Pulumi.

- Install the required dependencies.

```
npm install
```

- Build the Lambda functions.

```
npm run build
```

- Create a [Telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) using [@BotFather](https://telegram.me/BotFather).

- Create a new Pulumi stack.

```
pulumi stack init <stack_name>
```

- Configure the AWS region you want to deploy into.

```
pulumi config set aws:region <aws_region>
```

- Add the Telegram Bot token received as a secret to Pulumi config

```
pulumi config set tgBotToken <your_token> --secret
```

- Deploy the application.

```
pulumi up
```

- You can check the bot's status with the `/health` endpoint.

```
curl $(pulumi stack output apiUrl)/health
```

- Using `set-webhook` endpoint, register the bot's webhook on Telegram

```
curl -X POST $(pulumi stack output apiUrl)/set-webhook
```

## Usage

Now you can `/start` a conversation with the bot.

## Removal

- To delete the project from AWS.

```
pulumi destroy
```

- Talk to [@BotFather](https://telegram.me/BotFather) to delete the bot.

## Acknowledgements

- [Serverless Telegram Bot - Python Example](https://github.com/serverless/examples/tree/master/aws-python-telegram-bot)
- [Telegram notifications bot with Firebase Cloud Functions](https://medium.com/@maail/telegram-notifications-bot-with-firebase-cloud-functions-4d88fd88cd78)
