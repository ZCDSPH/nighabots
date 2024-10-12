const axios = require('axios');

module.exports = {
    name: "ai",
    usedby: 0,
    dmUser: false,
    dev: "𝙼𝚊𝚛𝚓𝚑𝚞𝚗 𝙱𝚊𝚢𝚕𝚘𝚗",
    nickName: ["chatgpt", "gpt"],
    info: "EDUCATIONAL",
    onPrefix: false,
    cooldowns: 6,

    onReply: async function ({ reply, api, event }) {
        const { threadID, senderID } = event;

        const followUpApiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/gptconvo?ask=${encodeURIComponent(reply)}&id=${senderID}`;
api.setMessageReaction("⏱️", event.messageID, () => {}, true);        try {
            const response = await axios.get(followUpApiUrl);
            const { response: followUpResult } = response.data;
 
           api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.sendMessage(`𝐓𝐎𝐒𝐇𝐈𝐀 𝐂𝐇𝐀𝐓𝐁𝐎𝐓\n━━━━━━━━━━━━━━━━━━\n ${followUpResult}\n━━━━━━━━━━━━━━━━━━`, threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID);
        }
    },

    onLaunch: async function ({ event, actions, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

        const apiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/gptconvo?ask=${encodeURIComponent(target.join(" "))}&id=${id}`;

        const lad = await actions.reply("🔎 | 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙵𝙾𝚁 𝙰𝙽𝚂𝚆𝙴𝚁 , 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃", threadID, messageID);

        try {
            if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
                const attachment = event.messageReply.attachments[0];

                if (attachment.type === "photo") {
                    const imageURL = attachment.url;

                    const geminiUrl = `https://joncll.serv00.net/chat.php?ask=${encodeURIComponent(target.join(" "))}&imgurl=${encodeURIComponent(imageURL)}`;
                    const response = await axios.get(geminiUrl);
                    const { vision } = response.data;

                    if (vision) {
                        return api.editMessage('𝐓𝐎𝐒𝐇𝐈𝐀 𝐈𝐌𝐀𝐆𝐄 𝐑𝐄𝐂𝐎𝐆𝐍𝐈𝐓𝐈𝐎𝐍 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 \n━━━━━━━━━━━━━━━━━━\n${vision}\n━━━━━━━━━━━━━━━━━━\n`, lad.messageID, event.threadID, messageID);
                    } else {
                        return api.sendMessage("🤖 Failed to recognize the image.", threadID, messageID);
                    }
                }
            }

            const response = await axios.get(apiUrl);
            const { response: result } = response.data;

            const responseMessage = `𝐓𝐎𝐒𝐇𝐈𝐀 𝐂𝐇𝐀𝐓𝐁𝐎𝐓\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━`;
            api.editMessage(responseMessage, lad.messageID, event.threadID, messageID);

            global.client.onReply.push({
                name: this.name,
                messageID: lad.messageID,
                author: event.senderID,
            });

        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID, messageID);
        }
    }
};
