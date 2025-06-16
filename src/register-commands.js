require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
	{
		name: 'hey',
		description: 'Replies with hey',
	},
	{
		name: 'worship',
		description: 'Pledges your worship to Bat',
	},
	{
		name: 'list',
		description: 'Allows you to add or remove from selected list!',
		options: [
			{
				name: 'modify',
				description: 'Allows you to select between adding and removing a name from the whitelist!',
				required: true,
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: 'additem',
						description: 'Allows you to add a name to the whitelist!',
						value: 'add',
					},
					{
						name: 'removeitem',
						description: 'Allows you to remove a name from the whitelist!',
						value: 'remove',
					},
				],
			},
			{
				name: 'rank',
				description: 'Selects which list you wish to modify',
				required: true,
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: 'Boosters',
						description: 'Selects the booster list',
						value: 'Booster',
					},
					{
						name: 'Collab',
						description: 'Selects the Collab list',
						value: 'Collab',
					},
					{
						name: 'DJ',
						description: 'Selects the DJ list',
						value: 'DJ',
					},
					{
						name: 'Dancer',
						description: 'Selects the dancer list',
						value: 'Dancer',
					},
					{
						name: 'DancerTrial',
						description: 'Selects the trial dancer list',
						value: 'DancerTrial',
					},
					{
						name: 'Hosts',
						description: 'Selects the hosts list',
						value: 'Host',
					},
					{
						name: 'LeadDancer',
						description: 'Selects the lead dancer list',
						value: 'LeadDancer',
					},
					{
						name: 'Management',
						description: 'Selects the management list',
						value: 'Management',
					},
					{
						name: 'Owner',
						description: 'Selects the owner list',
						value: 'Owner',
					},
					{
						name: 'Partner',
						description: 'Selects the partner list',
						value: 'Partners',
					},
					{
						name: 'Photographers',
						description: 'Selects the photographer list',
						value: 'Photographers',
					},
					{
						name: 'Security',
						description: 'Selects the security list',
						value: 'Security',
					},
					{
						name: 'Patreon',
						description: 'Selects the patreon list',
						value: 'Patreon',
					},
					{
						name: 'WorldDev',
						description: 'Selects the security list',
						value: 'WorldDev',
					},
				],
			},
			{
				name: 'privilege',
				description: 'Selects the privilege that the user should be able to have',
				required: true,
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: 'Staff',
						description: 'Gives the user staff privileges in the worlds',
						value: 'Staff',
					},
					{
						name: 'VIP',
						description: 'Gives the user VIP privelages in the worlds',
						value: 'VVIP',
					}
				]
			},
			{
				name: 'vrcusername',
				description: 'The VRC username that you wish to add or remove from the whitelist',
				required: true,
				type: ApplicationCommandOptionType.String,
			},
		],
	},
	{
		name: 'showname',
		description: 'Displays users with a specific tag',
		options: [
			{
				name: 'tag',
				description: 'Select the tag of the users you want to see',
				required: true,
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: 'Staff',
						value: 'Staff',
					},
					{
						name: 'Collab',
						value: 'Collab',
					},
					{
						name: 'Booster',
						value: 'Booster',
					},
					{
						name: 'DJ',
						value: 'DJ',
					},
					{
						name: 'Dancer',
						value: 'Dancer',
					},
					{
						name: 'DancerTrial',
						value: 'DancerTrial',
					},
					{
						name: 'Host',
						value: 'Host',
					},
					{
						name: 'LeadDancer',
						value: 'LeadDancer',
					},
					{
						name: 'Management',
						value: 'Management',
					},
					{
						name: 'Owner',
						value: 'Owner',
					},
					{
						name: 'Partners',
						value: 'Partners',
					},
					{
						name: 'Photographers',
						value: 'Photographers',
					},
					{
						name: 'Security',
						value: 'Security',
					},
					{
						name: 'Patreon',
						value: 'Patreon',
					},
					{
						name: 'WorldDev',
						value: 'WorldDev',
					},
				],
			},
		],
	},
	{
		name: 'showtags',
		description: 'Displays all tags assigned to a specified username',
		options: [
		    {
		       name: 'username',
				description: 'The username whose tags you want to see',
				required: true,
				type: ApplicationCommandOptionType.String,
			},
		],
	}

	
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORDTOKEN);

(async () => {
	try {
		console.log('Registering slash commands');
		
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
			{ body: commands }
		);
		console.log('Slash command Registered successfully!');
	} catch (error) {
		console.log('There was an error:', error);
	}
})();
