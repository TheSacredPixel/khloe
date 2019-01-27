const { Command } = require('discord-akairo')
const util = require('util')

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			category: 'owner',
			ownerOnly: true,
			quoted: false,
			args: [
				{
					id: 'code',
					match: 'content'
				}
			]
		})
	}

	exec(msg, { code }) {
		if (msg.content.includes('config.token') || msg.content.includes('client.token')) return
		try {
			let evaled = eval(code)
			if (typeof evaled !== 'string')
				evaled = util.inspect(evaled)

			msg.channel.send(`:ballot_box_with_check: Input:\`\`\`js\n${code}\n\`\`\`\n:white_check_mark: Output:\n\`\`\`js\n${clean(evaled)}\n\`\`\``)
		}
		catch(err) {
			msg.channel.send(`:ballot_box_with_check: Input:\`\`\`js\n${code}\n\`\`\`\n:x: ERROR:\`\`\`js\n${clean(err)}\n\`\`\``)
		}
	}
}

function clean(text) {
	if (typeof(text) === 'string')
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
	else
		return text
}

module.exports = EvalCommand
