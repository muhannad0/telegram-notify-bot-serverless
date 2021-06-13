import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { Telegraf } from 'telegraf'

if (!process.env.TG_BOT_TOKEN) {
  throw new Error('Telegram Bot token not found!')
}

const bot = new Telegraf(process.env.TG_BOT_TOKEN)

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const response = {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: 'Not Found',
  }

  const webhookUrl = `https://${event.headers.Host}/webhook`

  try {
    await bot.telegram.setWebhook(webhookUrl)
    response.statusCode = 200
    response.body = JSON.stringify({ url: webhookUrl })
  } catch (err) {
    console.log(err)
  }

  return response
}
