const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "join",
    version: "3.0",
    author: "Vex_Kshitiz",
    countDown: 5,
    role: 2,
    shortDescription: "Join the group that bot is in",
    longDescription: "",
    category: "owner",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const groupList = await api.getThreadList(300, null, ["INBOX"]);

      const filteredList = groupList.filter(
        (group) => group.threadName !== null || group.name !== null
      );

      if (filteredList.length === 0) {
        api.sendMessage("No group chats found.", event.threadID);
      } else {
        const formattedList = filteredList.map(
          (group, index) =>
            `${index + 1}. ${group.threadName || group.name}\n𝐓𝐈𝐃: ${group.threadID}`
        );

        const start = 0;
        const currentList = formattedList.slice(start, start + 5);

        const message = `╭─╮\n│𝗹𝗶𝘀𝘁 𝗼𝗳 𝙃ō𝙩𝙖𝙧ō 𝙊𝙧𝙚𝙠𝙞🕸️ 𝗰𝗵𝗮𝘁𝘀:\n${currentList.join(
          "\n"
        )}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: "join",
          messageID: sentMessage.messageID,
          author: event.senderID,
          start,
        });
      }
    } catch (error) {
      console.error("Error listing group chats", error);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, start } = Reply;

    if (event.senderID !== author) {
      return;
    }

    const userInput = args.join(" ").trim().toLowerCase();

    try {
      const groupList = await api.getThreadList(300, null, ["INBOX"]);
      const filteredList = groupList.filter(
        (group) => group.threadName !== null || group.name !== null
      );

      if (userInput === "next") {
        const nextPageStart = start + 5;
        if (nextPageStart >= filteredList.length) {
          api.sendMessage(
            "End of list reached.",
            event.threadID,
            event.messageID
          );
          return;
        }

        const currentList = filteredList
          .slice(nextPageStart, nextPageStart + 5)
          .map(
            (group, index) =>
              `${nextPageStart + index + 1}. ${group.threadName || group.name}\n𝐓𝐈𝐃: ${group.threadID}`
          );

        const message = `╭─╮\n│𝗹𝗶𝘀𝘁 𝗼𝗳 𝗧𝗪𝗜𝗡𝗞𝗟𝗘 𝗰𝗵𝗮𝘁𝘀🐣🎀:\n${currentList.join(
          "\n"
        )}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: "join",
          messageID: sentMessage.messageID,
          author: event.senderID,
          start: nextPageStart,
        });
      } else if (userInput === "previous") {
        const prevPageStart = Math.max(start - 5, 0);

        if (prevPageStart < 0) {
          api.sendMessage(
            "Already at the beginning of the list.",
            event.threadID,
            event.messageID
          );
          return;
        }

        const currentList = filteredList
          .slice(prevPageStart, prevPageStart + 5)
          .map(
            (group, index) =>
              `${prevPageStart + index + 1}. ${group.threadName || group.name}\n𝐓𝐈𝐃: ${group.threadID}`
          );

        const message = `╭─╮\n│𝗹𝗶𝘀𝘁 𝗼𝗳 𝗧𝗪𝗜𝗡𝗞𝗟𝗘 𝗰𝗵𝗮𝘁𝘀🐣🎀:\n${currentList.join(
          "\n"
        )}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: "join",
          messageID: sentMessage.messageID,
          author: event.senderID,
          start: prevPageStart,
        });
      } else if (!isNaN(userInput)) {
        const groupIndex = parseInt(userInput, 10);
        if (groupIndex <= 0 || groupIndex > filteredList.length) {
          api.sendMessage(
            "Invalid group number.\nPlease choose a number within the range.",
            event.threadID,
            event.messageID
          );
          return;
        }

        const selectedGroup = filteredList[groupIndex - 1];
        const groupID = selectedGroup.threadID;

        await api.addUserToGroup(event.senderID, groupID);
        api.sendMessage(
          `You have joined the group chat: ${selectedGroup.threadName || selectedGroup.name}`,
          event.threadID,
          event.messageID
        );
      } else {
        api.sendMessage(
          'Invalid input.\nPlease provide a valid number or reply with "next" or "previous".',
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.error("Error handling join command", error);
      api.sendMessage(
        "An error occurred while processing your request.",
        event.threadID,
        event.messageID
      );
    }

    global.GoatBot.onReply.delete(event.messageID);
  },
};
