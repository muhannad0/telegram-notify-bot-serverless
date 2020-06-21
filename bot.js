const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

const helpMsg = `Command reference:
/start - Start bot
/whoami - Show information about the current user
/help - Show this help page`;

bot.start((ctx) => {
    return ctx.reply(`Hello from Lambda, ${ctx.from.first_name ? ctx.from.first_name : 'friend'}! Use /help to view available commands.`);
});

bot.help((ctx) => {
    return ctx.reply(helpMsg);
});

bot.command('whoami', (ctx) => {
    let userInfo = JSON.stringify(ctx.from);
    return ctx.reply(`User info: ${userInfo}`);
})

// bot.on('message', (ctx) => {
//   console.log(ctx.message);
//   return ctx.reply(body.message.text);
// });

module.exports = {
    bot
}