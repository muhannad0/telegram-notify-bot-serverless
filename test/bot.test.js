const TelegramServer = require('telegram-test-api');
const { bot } = require('../bot')

test('check for bot object', () => {
    expect(typeof bot).toBe('object');
    expect(bot).toMatchObject({ telegram: {} });
})

describe('testing for bot commands', () => {
    // referring to example https://www.npmjs.com/package/telegram-test-api
    let serverConfig = {port: 9001};
    const token = 'sampleToken';
    let server;
    let client;
    
    beforeAll(() => {
        server = new TelegramServer(serverConfig)
        server.start().then(() => {
            client = server.getClient(token)
        })
        await bot.startWebhook('http://localhost', null, 9001)
        
    })

    afterAll(() => {
        this.slow(2000);
        this.timeout(10000);
        return server.stop();
        return bot.stop()
    })

    test('check for /start command', async () => {
        var res = await testApi.sendMessageWithText('/help')
        console.log(res.data)
        // expect(typeof res.data.).toBe('string')
    })
})
