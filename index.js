const { Telegraf } = require('telegraf');
const { Extra, Markup } = require('telegraf');
require('dotenv').config();
const api = require("covid19-api");
const bot = new Telegraf(process.env.BOT_TOKEN);
const COUNTRIES_LIST =require('./constans')

bot.telegram.setMyCommands([
    {command: '/start', description: "started introduce"},
    {command: '/help', description: "get information"},
    {command: '/special', description: "user information"}
])

bot.start(async (ctx) => {
    ctx.reply(`
        You username ${ctx.message.from.username}!
        Here You can know statistics of Coronavirus.
        /help Help you to see all country statistics.
        `,
        Markup.keyboard([['UZBEKISTAN', 'RUSSIA'],['US', 'CHINA']]).resize()
    );
});



bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('special', (ctx) => {
    return ctx.reply(
        'Special buttons keyboard',
        Markup.keyboard([
            Markup.button.contactRequest('Send contact'),
            Markup.button.locationRequest('Send location')
        ]).resize()
    )
})
bot.help((ctx) => ctx.reply(COUNTRIES_LIST))
bot.on('text', async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(ctx.message.text);

        const formatData = `
Country:${data[0][0].country}
Events:${data[0][0].cases}
Deaths:${data[0][0].deaths}  
Recovered:${data[0][0].recovered}  
    `;
        ctx.reply(formatData);
    } catch {
        ctx.reply('Error, Not found country')
    }

});
bot.launch();


console.log('bot yoqildi')



/*
bot.on('message', async msg => {
    console.log(msg)
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
        /!*await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/poppy2vk/png/11.png')*!/
        await bot.sendMessage(chatId, 'welcome to confirmation telegram bot')
    }
    if (text === '/info') {
        await bot.sendMessage(chatId, `you name ${msg.from.first_name} ${msg.from.last_name}`)
    }
})*/
