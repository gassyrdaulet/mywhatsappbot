const qrcode = require('qrcode-terminal')
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios')

console.log("Wait, please. The client is now starting...")

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    const content = message.body

    if(content === 'Как меня зовут?') {
        client.sendMessage(message.from, message._data.notifyName)
    }
    else if(content === 'Здравствуйте'){
        client.sendMessage(message.from, 'И вам Здравствуйте!')
    }
    else if(message.from === '77025128757@c.us' || message.from === '77768290879@c.us'){
        const meme = await axios("https://meme-api.herokuapp.com/gimme").then(res => res.data)
        client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url))
    }
});

client.initialize();
 