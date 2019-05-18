module.exports = {

	firstCapital(string) {
		let split = string.split(' '), words = []
		for(const item of split)
			words.push(item[0].toUpperCase() + item.substring(1).toLowerCase())
		return words.join(' ')
	},

	getServer(input, servers) {
		input = input.split(' ')

		let server, pos = -1
		for (let i = 0; i < input.length; i++) {
			let string = module.exports.firstCapital(input[i])
			if(servers.includes(string)) {
				server = string
				pos = i
				break
			}
		}

		if(pos !== -1)
			input.splice(pos, 1)
		input = input.join(' ')

		return { server: server, text: input }
	},

	promptReaction(m, id, time = 30000) {
		return new Promise(resolve => {
			m.react('✅')
			m.react('❌')
			let collector = m.createReactionCollector((r, user) => user.id === id && (r.emoji.name === '✅' || r.emoji.name === '❌'), {time: time})
			collector.on('collect', async r => {
				collector.stop()
				resolve(r)
			})
		})
	},

	promptMessage(channel, id, time = 30000) {
		return new Promise(resolve => {
			let collector = channel.createMessageCollector(m => m.author.id === id, {time: time})
			collector.on('collect', async m => {
				collector.stop()
				resolve(m)
			})
		})
	},

	toEmbed: {
		characterFromSearch(char) {
			const embed = {}
			embed.title = char.name
			embed.color = 0x5990ff
			embed.thumbnail = {
				url: char.avatar
			}
			embed.fields = [{
				name: 'Server',
				value: char.server,
				inline: true
			},
			{
				name: 'ID',
				value: char.id,
				inline: true
			}]
			return embed
		},

		recipeFromSearch(rec) {
			const embed = {}
			embed.title = rec.name
			embed.color = 0x5990ff
			embed.thumbnail = {
				url: rec.icon
			}
			embed.fields = [{
				name: 'ID',
				value: rec.id,
				inline: true
			}]
			return embed
		},

		recipe(recipe, ingredients) {
			let list = ''
			for(let ing of ingredients) {
				list += `${ing.n}x ${ing.i.name}\n`
			}

			const embed = {}
			embed.title = recipe.name
			embed.color = 0x5990ff
			embed.thumbnail = {
				url: recipe.icon
			}
			embed.fields = [{
				name: 'Class',
				value: recipe.class_job.abbreviation,
				inline: true
			},
			{
				name: 'Level',
				value: recipe.recipe_level_table.class_job_level,
				inline: true
			},
			{
				name: 'Ingredients',
				value: list,
				inline: false
			}]
			embed.footer = `ID: ${recipe.id} - ${recipe.game_patch.name}`
			return embed
		},

		fflogs(char, avg, highest) {
			const embed = {}
			embed.title = char.name
			embed.color = 0x5990ff
			embed.thumbnail = {
				url: char.avatar
			}
			embed.fields = [{
				name: 'Best Performance Average',
				value: avg.toString(),
				inline: false
			},
			{
				name: 'Highest Historical Parse',
				value: `${highest.encounterName} - ${highest.percentile}% (${highest.spec})`,
				inline: false
			},
			{
				name: 'Server',
				value: char.server,
				inline: false
			}]
			embed.url = `https://www.fflogs.com/character/id/${highest.characterID}`
			return embed
		}
	}
}
