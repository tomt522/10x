const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "hiji",
    aliases: [],
    author: "Mahi--",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image using Hiji API.",
    longDescription: "Generates an image based on the provided prompt using the Hiji API.",
    category: "fun",
    guide: {
      en: "{p}hiji <prompt>"
    }
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const checkAuthor = Buffer.from('TWFoaS0t', 'base64').toString('utf8');
    if (this.config.author !== checkAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    if (args.length === 0) {
      return api.sendMessage("❌ | Please provide a prompt.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    const hijiApiUrl = `https://upoldev-apihub.onrender.com/upol/horny-niji?prompt=${encodeURIComponent(prompt)}&apikey=UPoLGitDev69`;

    api.sendMessage("⏳ | Please wait, we're making your picture.", event.threadID, event.messageID);

    try {
      const hijiResponse = await axios.get(hijiApiUrl, { responseType: "arraybuffer" });

      const cacheFolderPath = path.join(__dirname, "/cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(hijiResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "",
        attachment: stream
      });
    } catch (error) {
      console.error("Error details:", error);
      message.reply(`❌ | An error occurred: ${error.message}. Please try again later.`);
    }
  }
};
