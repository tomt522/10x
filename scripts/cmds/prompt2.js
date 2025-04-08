const axios = require('axios');
module.exports = {
  config: {
    name: "prompt2",
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    guide: { en: "{pn} <prompt>" },
    longDescription: {
      en: "Get image generator prompt by replying image and by text"
    },
    category: "image"
  },
  onStart: async function ({ message, event, args, api }) {
    try {
      let imageUrl;
      let khankirChele = args.join(" ");

      if (event.type === "message_reply") {
        if (["photo", "sticker"].includes(event.messageReply.attachments[0]?.type)) {
          imageUrl = event.messageReply.attachments[0].url;
        } else {
          return api.sendMessage({ body: "Reply must be an image." }, event.threadID, event.messageID);
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        imageUrl = args[0];
      } else if (!khankirChele) {
        return api.sendMessage({ body: "Reply to an image or provide a prompt." }, event.threadID, event.messageID);
      }

      if (imageUrl) {
        const response = await axios.post(`https://rehatdesu.xyz/api/imagine/i2p?url=${encodeURIComponent(imageUrl)}`);
        const description = response.data.result;

        await message.reply(description);
      } else if (khankirChele) {
        const response = await axios.get(`https://rehatdesu.xyz/api/imagine/t2p?text=${encodeURIComponent(khankirChele)}`);
        const prompt = response.data.response;
        await message.reply(prompt);
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred.");
    }
  }
};
