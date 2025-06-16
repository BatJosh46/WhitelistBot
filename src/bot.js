const { Client, IntentsBitField, MessagePayload, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] });
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

client.once('ready', () => {
 console.log('Ready!');
});

client.on('ready', (c) => {
	console.log(`${c.user.tag} is online!`);
});

client.on('interactionCreate', async (interaction) => {
	if(!interaction.isChatInputCommand()) return;
	
	if(interaction.commandName === 'hey') {
		interaction.reply('hey!');
	}

	if (interaction.commandName === 'worship') {
		// Makes the embed that will be sent
		const Worship = new EmbedBuilder().setTitle(`You have now pledged your worship to BatJosh and you shall do so by leaving chocolate on your windowsill every single night or thou shall suffer the consequences!!!`).setColor(0xff0000);

		// Send the usernames in the reply
		interaction.reply({ embeds: [Worship] });
	}

	if (interaction.commandName === 'list') {
		if (interaction.options.get('modify').value === 'add') {
			const rank = interaction.options.get('rank').value;
			const username = interaction.options.get('vrcusername').value;
			const privilege = interaction.options.get('privilege').value;


			// Makes the embed that will be sent
			const AddToList = new EmbedBuilder().setTitle(`\`\`\`${username}\`\`\` added to the whitelist with the following tags:`).setColor(0x00ff00).addFields({ name: `Rank:`, value: `${rank}`, inline: true }, { name: `Privilege`, value: `${privilege}`, inline: true });

			// Send the usernames in the reply
			//interaction.reply(`${username} added to the whitelist.`);
			interaction.reply({ embeds: [AddToList] });
			

			
			appendToFile(username, rank, privilege, 'Added User')
			.then(data => {
				console.log(data);
				//return interaction.editReply(`${username} added to the whitelist.`);
				return interaction.editReply({ embeds: [AddToList] });
			})
			.catch(error => {
				console.error('Error:', error);
				try {
					return interaction.editReply(`The following error occurred while processing your request: ${error}`);
				} 
				catch (editError) 
				{
					console.error('Failed to edit reply:', editError);
				}
			})
		}

		if (interaction.options.get('modify').value === 'remove') {
			const usernameToRemove = interaction.options.get('vrcusername').value;

			// Makes the embed that will be sent
			const RemoveFromList = new EmbedBuilder().setTitle(`\`\`\`${usernameToRemove}\`\`\` has been removed from the whitelist!`).setColor(0xff0000);

			// Send usernames in reply
			//interaction.reply(`${usernameToRemove} removed from the whitelist.`);
			interaction.reply({ embeds: [RemoveFromList] });


			removeFromFile(usernameToRemove, 'Removed User')
			.then(data => {
				console.log(data);
				//return interaction.editReply(`${usernameToRemove} removed from the whitelist.`);
				return interaction.editReply({ embeds: [RemoveFromList] });
			})
			.catch(error => {
				console.error('Error:', error);
				try {
					return interaction.editReply(`The following error occurred while processing your request: ${error}`);
				} 
				catch (editError) 
				{
					console.error('Failed to edit reply:', editError);
				}
			})
		}
	}

	if(interaction.commandName === 'showname') {
		const rankOrPrivilege = interaction.options.getString('tag');

		// Get the file
		const file = await octokit.repos.getContent({
			owner: '',
			repo: '',
			path: '.json'
		});
	
		// Parse the file content
		const fileContent = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));
	
		// Filter the users by rank or privilege
		const usersWithRankOrPrivilege = Object.entries(fileContent)
			.filter(([, user]) => user.Rank === rankOrPrivilege || user.Privilege === rankOrPrivilege)
			.map(([username]) => username);

		// Makes the embed that will be sent
		const EmbedShowName = new EmbedBuilder().setTitle(`Users with rank or privilege ${rankOrPrivilege}:`).setColor('Random').setDescription(`\`\`\`\n${usersWithRankOrPrivilege.join('\n')}\`\`\``);

		// Send the usernames in the reply
		// interaction.reply(`Users with rank or privilege ${rankOrPrivilege}: \n${usersWithRankOrPrivilege.join('\n')}`);
		interaction.reply({ embeds: [EmbedShowName] });
	}

	if(interaction.commandName === 'showtags') 
	{
		const username = interaction.options.getString('username');

		// Get the file
		const file = await octokit.repos.getContent({
		    owner: '',
			repo: '',
			path: '.json'
		});

		// Parse the file content
		const fileContent = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));

		// Check if the username exists
		if (!fileContent.hasOwnProperty(username)) {
		    return interaction.reply(`Username ${username} does not exist.`);
		}

		// Get the user's tags
		const userTags = fileContent[username];

		// Makes the embed that will be sent
		const EmbedShowTags = new EmbedBuilder().setTitle(`Tags assigned to ${username}:`).setColor('Random').addFields({ name: `Rank:`, value: `${userTags.Rank}`, inline: true }, { name: `Privilege`, value: `${userTags.Privilege}`, inline: true});

		// Send the tags in the reply
		// interaction.reply(`Tags assigned to ${username}: Rank: ${userTags.Rank}, Privilege: ${userTags.Privilege}`);
		interaction.reply({ embeds: [EmbedShowTags] });
	}


});










async function appendToFile(username, rank, privilege, commitMessage) {
 // Get the file
 const file = await octokit.repos.getContent({
    owner: 'BatJosh46',
    repo: 'BewitchedVRlists',
    path: 'BewitchedVR/Whitelist.json'
 });

 const fileContent = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));
 
 // Check if the username already exists
 if (fileContent.hasOwnProperty(username)) {
    throw new Error(`Username ${username} already exists.`);
 }

 // Create a new user object
 const newUser = {};
 newUser[username] = {"Rank": rank, "Privilege": privilege};

 // Add the new user to the file content
 Object.assign(fileContent, newUser);
 
 const newContent = JSON.stringify(fileContent, null, 2);
 const encodedContent = Buffer.from(newContent).toString('base64');

 // Update the file
 await octokit.repos.createOrUpdateFileContents({
    owner: 'BatJosh46',
    repo: 'BewitchedVRlists',
    path: 'BewitchedVR/Whitelist.json',
    message: commitMessage,
    content: encodedContent,
    sha: file.data.sha // Provide the SHA of the file
 });

 console.log('Successfully added a new user to the file');
}


async function removeFromFile(username, commitMessage) {
 // Get the file
 const file = await octokit.repos.getContent({
    owner: 'BatJosh46',
    repo: 'BewitchedVRlists',
    path: 'BewitchedVR/Whitelist.json'
 });

 const fileContent = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));
 
 // Check if the username exists
 if (!fileContent.hasOwnProperty(username)) {
    throw new Error(`Username ${username} does not exist.`);
 }

 // Delete the user from the file content
 delete fileContent[username];
 
 const newContent = JSON.stringify(fileContent, null, 2);
 const encodedContent = Buffer.from(newContent).toString('base64');

 // Update the file
 await octokit.repos.createOrUpdateFileContents({
    owner: 'BatJosh46',
    repo: 'BewitchedVRlists',
    path: 'BewitchedVR/Whitelist.json',
    message: commitMessage,
    content: encodedContent,
    sha: file.data.sha // Provide the SHA of the file
 });

 console.log('Successfully deleted a user from the file');
}


client.login(process.env.DISCORDTOKEN);
