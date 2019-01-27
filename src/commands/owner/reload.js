const { Command } = require('discord-akairo')

class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			category: 'owner',
			ownerOnly: true,
			quoted: false,
			args: [
				{
					id: 'commandID'
				}
			],
		})
	}

	exec(message, args) {
		// `this` refers to the command object.
		this.handler.reload(args.commandID)
		return message.reply(`reloaded command ${args.commandID}!`)
	}
}

module.exports = ReloadCommand
