const { Command } = require('discord-akairo'),
	req = require('request-promise-native')

class FFLogsCommand extends Command {
	constructor() {
		super('fflogs', {
			aliases: ['fflogs', 'parse'],
			description: '',
			args: [
				{
					id: 'input',
					match: 'content'
				}
			]
		})
	}

	async exec(msg, { input }) {
		if(!input) {
			let char = this.client.provider.get(msg.author.id, 'identity')
			if(!char)
				return msg.util.send('You either need to give me a character name, or use the `iam` command to tell me who you are!')
			else
				return await getParses(char, msg, this.client)
		} else if(msg.mentions.users.first()) {
			let char = this.client.provider.get(msg.mentions.users.first().id, 'identity')
			if(!char)
				return msg.util.send('That user hasn\'t used the `iam` command to tell me who they are!')
			else
				return await getParses(char, msg, this.client)
		}
		//isolate char name and/or server
		let { server, text } = this.client.utils.getServer(input, this.client.xiv.resources.servers)
		if(!server && !this.client.config.xiv.datacenter)
			return msg.util.send('You need to give me a valid server to look in!')

		try {
			msg.channel.startTyping()

			//get char from lodestone. prompt for server if uncertain
			let res = await this.client.xiv.character.search(text, {
				server: server ? server : `_dc_${this.client.config.xiv.datacenter}`
			})
			if(!res.results.length) {
				msg.util.send('Character not found :(')
				return msg.channel.stopTyping()
			}
			let chars = res.results

			let matches = 0, match
			for (const c of chars) {
				if(c.name.toLowerCase() === text.toLowerCase()) {
					matches++
					match = c
				}
			}

			let char
			if(matches == 1) {//single perfect match
				return await getParses(match, msg, this.client)
			} else {//multiple or no matches, prompt
				if(match)
					char = match
				else
					char = chars[0]

				let embed = this.client.utils.toEmbed.characterFromSearch(char)
				msg.channel.stopTyping()
				let m = await msg.util.send('Is this the character you\'re looking for?', {embed: embed})
				let r = await this.client.utils.promptReaction(m, msg.author.id, ['✅','❌'])
				if(!r) return
				if(r.emoji.name === '✅') {
					msg.channel.startTyping()
					return await getParses(char, msg, this.client)
				} else if(r.emoji.name === '❌') {
					msg.util.send('What\'s the character\'s server?')
					let m = await this.client.utils.promptMessage(msg.channel, msg.author.id)
					if(!r) return
					msg.channel.startTyping()
					res = await this.client.xiv.character.search(text, {server: m.content})
					if(!res.results.length) {
						msg.channel.send('Character not found :(')
						return msg.channel.stopTyping()
					}

					char = res.results.find(result => result.name.toLowerCase() === text.toLowerCase())
					return await getParses(char, msg, this.client)
				}
			}

		} catch(err) {
			this.client.utils.throwError(err,msg)
			return msg.channel.stopTyping()
		}
	}
}

async function getParses(char, msg, {utils, config}) {
	return new Promise(async (resolve, reject) => {
		try {
			let parses = await req({
				uri: `https://www.fflogs.com:443/v1/parses/character/${char.name}/${utils.cleanDCFromServer(char.server)}/${config.xiv.region}`,
				qs: {
					api_key: config.keys.fflogs,
					timeframe: 'historical'
				},
				json: true
			})

			parses = parses.filter(p => p.difficulty === config.xiv.encounter_difficulty)

			if(!parses.length) {
				msg.channel.send(`I couldn't find ${char.name} of ${char.server} on FF Logs (or they have no parses for this raid cycle).`)
				return resolve(msg.channel.stopTyping())
			}

			let encounters = []
			for (const parse of parses) {
				if(!encounters.some(e => e.encounterName === parse.encounterName) || encounters.find(e => e.encounterName === parse.encounterName).percentile < parse.percentile) {
					encounters.push(parse)
				}
			}


			let percSum = 0, percNum = 0, highest
			for (const enc of encounters) {
				percNum++
				percSum += enc.percentile
				if(!highest || highest.percentile < enc.percentile)
					highest = enc
			}

			let embed = utils.toEmbed.fflogs(char, (Math.round((percSum / percNum) * 100) / 100), highest, parses)
			msg.channel.send('', {embed:embed})
			return resolve(msg.channel.stopTyping())

		} catch(err) {
			reject(err)
		}
	})
}

module.exports = FFLogsCommand
