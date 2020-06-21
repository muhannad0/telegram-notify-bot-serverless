'use strict';

const getResponseHeaders = () => {
  return {
      'Access-Control-Allow-Origin': '*'
  };
}

const helpMsg = `Command reference:
/start - Start bot
/whoami - Show information about the current user
/help - Show this help page`;

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports.hello = async event => {
  try {

    const body = JSON.parse(event.body);
    console.log(body);

    bot.start((ctx) => {
      return ctx.reply('Hello from Lambda! Use /help to view available commands.');
    });

    bot.help((ctx) => {
      return ctx.reply(helpMsg);
    });

    bot.command('whoami', (ctx) => {
      return ctx.reply(
        'Name: ' + ctx.from.first_name +
        '\nUsername: ' + ctx.from.username +
        '\nChat ID: ' + ctx.from.id);
    })

    await bot.handleUpdate(body);

    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(
        {
          message: 'Ok',
        })
    };

  } catch (err) {

    console.log("Error: ", err);
    return {
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: getResponseHeaders(),
        body: JSON.stringify({
          error: err.name ? err.name : "Exception",
          message: err.message ? err.message : "Unknown error"
        })
    };
  }
};

module.exports.setWebhook = async event => {
  try {

      let url = 'https://' + event.headers.Host + '/' + event.requestContext.stage + '/webhook';

      await bot.telegram.setWebhook(url);

      return {
          statusCode: 200,
          headers: getResponseHeaders(),
          body: JSON.stringify({url: url})
      };

  } catch (err) {
      console.log("Error: ", err);
      return {
          statusCode: err.statusCode ? err.statusCode : 500,
          headers: getResponseHeaders(),
          body: JSON.stringify({
              error: err.name ? err.name : "Exception",
              message: err.message ? err.message : "Unknown error"
          })
      };
  }
}