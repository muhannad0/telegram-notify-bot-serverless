# Serverless Telegram Bot on AWS

A simple NodeJS Telegram bot using the Serverless Framework.

## Frameworks Used
+ [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
+ [Telegraf Bot Framework](https://telegraf.js.org/)

## Requirements
+ AWS credentials [configured](https://serverless.com/framework/docs/providers/aws/guide/credentials/).
+ NodeJS 12.x.
+ A [Telegram](https://telegram.org/) account.

## Installation

+ Install the Serverless Framework
```
npm install -g serverless
```

+ Install the required plugins
```
npm install
```

+ Create a [Telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) using `@BotFather`

+ Add the token received to `serverless.env.yml` file
```
vi serverless.env.yml

TELEGRAM_TOKEN: <your_token>
```

+ Deploy the application.
```
serverless deploy
```

+ Using `setWebhook` URL the configuration, register the webhook on Telegram
```
curl -X POST https://<api_endpoint_url>/prod/setWebhook
```

## Usage
Now you can `/start` a conversation with the bot.

## Acknowledgements
+ [Serverless Telegram Bot - Python Example](https://github.com/serverless/examples/tree/master/aws-python-telegram-bot)