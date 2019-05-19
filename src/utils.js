module.exports = {

	firstCapital(string) {
		let split = string.split(' '), words = []
		for(const item of split)
			words.push(item[0].toUpperCase() + item.substring(1).toLowerCase())
		return words.join(' ')
	},

	decimalCommas(number) {
		return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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
		priceList(prices, item, servers) {
			let topPrices = ''
			for (let i = 0; i < prices.length; i++) {
				topPrices += `**${module.exports.firstCapital(servers[i])}:** ${module.exports.decimalCommas(prices[i].price_per_unit)} *x${prices[i].quantity}* = __${module.exports.decimalCommas(prices[i].price_total)}__${prices[i].materia.length ? ` w/ ${prices[i].materia.length} materia` : ''}${prices[i].is_hq ? ' (HQ)' : ''}\n${i === 0 ? '\n' : ''}`
			}

			return {
				title: item.name,
				color: 0x5990ff,
				thumbnail: {
					url: 'https://xivapi.com' + item.icon
				},
				fields: [{
					name: 'Current Lowest Prices',
					value: topPrices,
					inline: false
				}]
			}
		},

		characterFromSearch(char) {
			return {
				title: char.name,
				color: 0x5990ff,
				thumbnail: {
					url: char.avatar
				},
				fields: [{
					name: 'Server',
					value: char.server,
					inline: true
				},
				{
					name: 'ID',
					value: char.id,
					inline: true
				}]
			}
		},

		recipeFromSearch(rec) {
			return {
				title: rec.name,
				color: 0x5990ff,
				thumbnail: {
					url: rec.icon
				},
				fields: [{
					name: 'ID',
					value: rec.id,
					inline: true
				}]
			}
		},

		recipe(recipe, ingredients) {
			let list = ''
			for(let ing of ingredients) {
				list += `${ing.n}x ${ing.i.name}\n`
			}

			return {
				title: recipe.name,
				color: 0x5990ff,
				thumbnail: {
					url: recipe.icon
				},
				fields: [{
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
				}],
				footer: {
					text: `ID: ${recipe.id} - ${recipe.game_patch.name}`
				}
			}
		},

		fflogs(char, avg, highest) {
			return {
				title: char.name,
				color: 0x5990ff,
				thumbnail: {
					url: char.avatar
				},
				fields: [{
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
				}],
				url: `https://www.fflogs.com/character/id/${highest.characterID}`
			}
		}
	}
}
