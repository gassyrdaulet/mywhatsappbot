const qrcode = require('qrcode-terminal')
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios')

const isOnProduction = false

console.log("Wait, please. The client is now starting...")

const adminNumber = '77768290879'
let isBotActive = true

const config = {
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
}
const config2 = {
    authStrategy: new LocalAuth(),
}

const client = new Client(isOnProduction?config:config2);

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    if(message.from === adminNumber + '@c.us' && message.body === '/SwitchPower'){
        isBotActive = !isBotActive
        client.sendMessage(message.from, 'Бот ' + (isBotActive?'включен':'выключен'))
        return
    }

    const content = message.body

    if(isBotActive){
        if(content === 'Привет'){
            client.sendMessage(message.from, `Здравствуйте, ${message._data.notifyName}!`)
        }
        else if(content === 'Погода'){
            try{
                const {data: weather} = await axios('https://api.openweathermap.org/data/2.5/weather?q=Astana,kz&APPID=13c2c421aae0c7fb2bd8faa16e75c919&lang=ru&units=metric')
                console.log(weather)
                message.reply(`Погода в городе ${weather.name}: ${Math.floor(weather.main.temp)}C°, ${weather.weather[0].description}`)
            }catch(e){
                console.log(e)
            }
        }
        else if(content === 'meme pls'&&(message.from === '77025128757@c.us' || message.from === '77768290879@c.us')){
            const meme = await axios("https://meme-api.herokuapp.com/gimme").then(res => res.data)
            client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url))
        }
    }
});

client.initialize();
 