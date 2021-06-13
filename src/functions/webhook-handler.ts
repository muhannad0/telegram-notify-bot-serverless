import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { Telegraf } from 'telegraf'
import { initBotCommands } from './bot-commands'

if (!process.env.TG_BOT_TOKEN) {
  throw new Error('Telegram Bot token not found!')
}

const bot = new Telegraf(process.env.TG_BOT_TOKEN, {
  telegram: { webhookReply: true },
})

initBotCommands(bot)

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  }

  if (!event.body) {
    return response
  }

  try {
    const update = JSON.parse(event.body)
    await bot.handleUpdate(update)
  } catch (err) {
    console.log(err)
  }

  return response
}
