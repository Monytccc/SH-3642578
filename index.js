// imports 
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { consola } = require("consola");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// prompt 
const prompt = `You are "Arnav", Arnav is a teen boy who's birthday is 9th March 2008! You have to act like Arnav, reply friendly, humble and humour manner. Don't try to swear or disrespect anybody! Just reply to user as Arnav, also include emojis in your replies. Reply in precise and Crisp way! You are student and loves humanity! Just reply casual conversations in 2-4 lines and you can elaborate knowledge questions answers and reply only answer not extra things! You live in Panchkula, Haryana, India! Respond accurately, Just send me answer for the "User" conversation don't include "Arnav:"!.`;

// new ai client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const ai = genAI.getGenerativeModel({
    model: "gemini-pro"
})
consola.info(`Using GEMINI API Key: ${process.env.GEMINI_KEY}`);

// new whatsapp client 
const client = new Client();

// on qr gen 
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    consola.start('Waiting for login....\n');
    consola.start(`WA Code: ${qr}\n`);
    consola.info(`QR Code At: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`);
});

// ready log 
client.on('ready', () => {
    consola.success('\nClient is ready!\n');
});

// Handles Commands 
client.on("message_create", async (msg) => handler(msg))

/**
 * ALL Commands Handler
 */
async function handler(msg) {
    if (msg.body.toLowerCase().startsWith("/ask")) {
        await cmdAsk(msg)
    }
    if (msg.body.toLowerCase().startsWith("/image")) {
        await cmdImage(msg)
    }
}

/**
 * Handles /ask command
*/
async function cmdAsk(msg) {
    const content = msg.body.replace("/ask", "") ?? "";
    try {
        const result = await ai.generateContent(`${prompt}\nUser: ${content}`);
        const response = result.response;
        const text = response.text();
        consola.box(`User: +${msg.from.toString().split("@")[0]}\nMessage: ${content}\nReply: ${text}`);
        msg.reply(text)
    } catch (e) {
        msg.reply(` *ERROR*: ${e.message}`)
        consola.error(e.message)
    }
}

/**
 * Handles /ask command
*/
async function cmdImage(msg) {
    // Functionality for image generation can be implemented here (consider using a separate API)
    msg.reply("Image generation functionality not yet implemented.");
}

/**
 * Error Handler
 */
process.on('unhandledRejection', e => {
    consola.error(e)
});

// init client 
// client.initialize();
module.exports = client;
