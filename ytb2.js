const axios = require("axios");
module.exports = {
  config: {
    name: "ytb2",
author: "Jun",
countDown: 10,
    role: 0,
    category: "media"
  },
  onStart: async function ({ message, args, event }) {
const pr = await global.utils.getPrefix(event.threadID) + this.config.name;
    try {
      const type = args[0]?.toLowerCase();
      if (!type || !['music', 'video'].includes(type)) {
        return message.reply(`Invalid usage. Please use: ${pr} music or video  <title>\n\nexample ${pr} music metamorphosis`);
      }
      const title = args.slice(1).join(" ");
      if (!title) return message.reply("Please add title");
      const { data } = await axios.get(`https://apiv3-2l3o.onrender.com/yts?title=${title}`);
      const videos = data.videos.slice(0, 6);
      const { messageID } = await message.reply({
        body: videos.map((vid, i) => `${i + 1}. ${vid.title}\nDuration: ${vid.duration}\n`).join("\n") + "\nPlease choose a video by replying 1 to 6",
        attachment:   await Promise.all(videos.map(video => global.utils.getStreamFromURL(video.thumb)))
      });      global.GoatBot.onReply.set(messageID, {
        commandName: this.config.name,
        messageID,
        videos,
        type,
        sender: event.senderID
      });
    } catch (error) {
 message.reply(e.data?.error || e.message);
    }
  },
  onReply: async function ({ message, event, Reply }) {
    const { videos, sender, messageID, type } = Reply;
    if (event.senderID !== sender) return;
    const choice = parseInt(event.body, 10);
    if (isNaN(choice) || choice < 1 || choice > videos.length) {
     return message.reply("Please reply with a number between 1 and 6 only.");
    }
    const { url, title, duration } = videos[choice - 1];
    const { data: { url: link } } = await axios.get(`https://apiv3-2l3o.onrender.com/ytb?link=${url}&type=${type}`);
 message.unsend(messageID);
    message.reply({
      body: `${title} (${duration})`,
      attachment: await global.utils.getStreamFromURL(link)
    });
  }
};
