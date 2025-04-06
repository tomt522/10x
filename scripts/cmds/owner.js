const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "owner",
		aliases: ["info"],
		author: "Rexy",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "admin",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const ownerInfo = {
				name: '𝙍𝙄𝙁𝘼𝙏 𝙅𝘼𝙈𝙄𝙇 ',
				class: '𝘾𝙡𝙖𝙨𝙨 10 ',
				group: '𝑺𝑪𝑰𝑬𝑵𝑪𝑬',
				gender: '𝑴𝑨𝑳𝑬',
				Birthday: '23 November',
				religion: '𝑰𝑺𝑳𝑨𝑴',
				hobby: '𝑭𝒍𝒊𝒓𝒕𝒊𝒏𝒈 😁',
				Fb: 'https://www.facebook.com/rifat5xr',
				Relationship: '𝙨𝙞𝙣𝙜𝙡𝙚 ',
				Height: '5"5'
			};

			const bold = 'https://i.imgur.com/DpMSasE.mp4';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const videoResponse = await axios.get(bold, { responseType: 'arraybuffer' });
			const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

			fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

			const response = `
𓀬 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 𓀬 \n
 ~𝙉𝘼𝙈𝙀: ${ownerInfo.name}
 ~𝘾𝙇𝘼𝙎𝙎: ${ownerInfo.class}
 ~𝙂𝙍𝙊𝙐𝙋: ${ownerInfo.group}
 ~𝙂𝙀𝙉𝘿𝙀𝙍: ${ownerInfo.gender}
 ~𝘽𝙄𝙍𝙏𝙃𝘿𝘼𝙔: ${ownerInfo.Birthday}
 ~𝙍𝙀𝙇𝙄𝙂𝙄𝙊𝙉: ${ownerInfo.religion}
 ~𝙍𝙀𝙇𝘼𝙏𝙄𝙊𝙉𝙎𝙃𝙄𝙋: ${ownerInfo.Relationship}
 ~𝙃𝙊𝘽𝘽𝙔: ${ownerInfo.hobby}
 ~𝙃𝙀𝙄𝙂𝙃𝙏: ${ownerInfo.Height}
 ~𝙁𝘽: ${ownerInfo.Fb}
			`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(videoPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(videoPath);

			api.setMessageReaction('😘', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in ownerinfo command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
