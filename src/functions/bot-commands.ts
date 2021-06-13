import { Telegraf, Context } from 'telegraf'

const helpMsg = `The bot just repeats anything you say in the chat.
\n*Command reference:*
    /start - Start bot
    /ping - *Pong!*
    /whoami - Show information about the current user
    /help - Show this help page`

export function initBotCommands(bot: Telegraf<Context<any>>): any {
  bot.start((ctx) => {
    return ctx.reply(
      `Hello from AWS Lambda, ${
        ctx.from.first_name ? ctx.from.first_name : 'friend'
      }! Use /help to view available commands.`,
    )
  })

  bot.help((ctx) => {
    return ctx.replyWithMarkdown(helpMsg)
  })

  bot.command('whoami', (ctx) => {
    const userInfo = JSON.stringify(ctx.from)
    return ctx.reply(`User info: ${userInfo}`)
  })

  bot.command('ping', (ctx) => {
    return ctx.replyWithMarkdown('*Pong!*')
  })

  bot.on('text', (ctx) => {
    return ctx.reply(ctx.message.text)
  })
}
