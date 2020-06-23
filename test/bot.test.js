const TelegramServer = require('telegram-test-api');
const { Telegraf } = require('telegraf');
// const bot = require('../bot');
// const { bot } = require('../bot')

// test('check for bot object', () => {
//     expect(typeof bot).toBe('object');
//     expect(bot).toMatchObject({ telegram: {} });
// })

describe('testing for bot commands', () => {
    // referring to example https://www.npmjs.com/package/telegram-test-api
    const serverConfig = { port: 9000 };
    const token = 'sampleToken';
    let server;
    let bot;
    beforeAll(() => {
        server = new TelegramServer(serverConfig)
        return server.start().then(() => {
            bot = new Telegraf(token, { telegram: { apiRoot: server.ApiURL } });
            bot.start((ctx) => ctx.reply('Welcome'));
            bot.startPolling();
        }).then(() => {
            return client = server.getClient(token, { timeout: 5000 });
        });
    });

    afterAll(() => {
        return bot.stop().then(() => server.stop());
    });

    test('check if client sent command', async () => {
        const message = client.makeCommand('/start');
        const result = await client.sendCommand(message);
        // console.log('result: ', result);
        expect(result.ok).toBe(true);
    });

    test('check if bot replied', async () => {
        const updates = await client.getUpdates();
        // console.log(`Client received messages: ${JSON.stringify(updates.result)}`);
        expect(updates.result.length).toBe(1);
        expect(updates.result[0].message.text).toBe('Welcome');
    });
})
