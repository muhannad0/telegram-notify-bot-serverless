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

  try {
    const botInfo = await bot.telegram.getMe()
    if (!botInfo) {
      throw new Error('Could not fetch Bot info!')
    }

    response.statusCode = 200
    response.body = JSON.stringify({ botInfo })
  } catch (err) {
    console.log(err)
    response.statusCode = 503
    response.body = JSON.stringify({ error: err.message })
  }

  return response
}
