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

	promptReaction(m, id, reactions, time = 30000) {
		return new Promise(async resolve => {
			for (const emoji of reactions) {
				await m.react(emoji)
			}
			let collector = m.createReactionCollector((r, user) => user.id === id && reactions.includes(r.emoji.name), {time: time})
			collector.on('collect', r => {
				resolve(r)
				collector.stop()
			})
			collector.on('end', () => {
				resolve(null)
			})
		})
	},

	promptMessage(channel, id, time = 30000) {
		return new Promise(resolve => {
			let collector = channel.createMessageCollector(m => m.author.id === id, {time: time})
			collector.on('collect', async m => {
				resolve(m)
				collector.stop()
			})
			collector.on('end', () => {
				resolve(null)
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

		recipe(recipe, list, fullList) {
			let basic = ''
			for(let mat of list.values()) {
				basic += `${mat.num}x ${mat.item.name}\n`
			}

			let fields = [{
				name: 'Class',
				value: recipe.class_job.abbreviation,
				inline: true
			},
			{
				name: 'Level',
				value: recipe.recipe_level_table.class_job_level,
				inline: true
			}]

			if(recipe.required_craftsmanship)
				fields.push({
					name: 'Craftsmanship',
					value: recipe.required_craftsmanship,
					inline: true
				})
			if(recipe.required_control)
				fields.push({
					name: 'Control',
					value: recipe.required_control,
					inline: true
				})

			fields.push({
				name: 'Ingredients',
				value: basic,
				inline: false
			})

			if(fullList) {
				let recipes = ''
				for(let rec of fullList.recipes) {
					recipes += `${rec.item_result.name} (${rec.class_job.abbreviation} lvl ${recipe.recipe_level_table.class_job_level})\n`
				}

				let mats = ''
				for(let pass = 1; pass <= 2; pass++) {
					for(let id of fullList.mats.keys()) {
						let mat = fullList.mats.get(id)
						if(pass === 1 && mat.item.id > 20) {//keep crystals at the bottom
							mats += `${mat.num}x ${mat.item.name}\n`
						}
						else if(pass === 2 && mat.item.id < 20) {
							mats += `${mat.num}x ${mat.item.name}\n`
						}
					}
					mats += '\n'
				}

				fields.push({
					name: 'Recipes',
					value: recipes,
					inline: false
				},
				{
					name: 'All Materials',
					value: mats,
					inline: false
				})
			}

			return {
				title: recipe.name,
				color: 0x5990ff,
				thumbnail: {
					url: recipe.icon
				},
				fields: fields,
				footer: {
					text: `ID: ${recipe.id} - ${recipe.game_patch ? recipe.game_patch.name : 'Patch 2.0'} | Click on the 🔍 react to look up material prices.`
				}
			}
		},

		fflogs(char, avg, highest, parses) {
			let latest = ''
			for(let i = 0; i < 5; i++) {
				if(!parses[i])
					break
				latest += `__${parses[i].encounterName}__ - ${parses[i].total}  **${parses[i].percentile}%** (${parses[i].spec})\n`
			}

			const colors = new Map().set(25, 0x666).set(50, 0x1EFF00).set(75, 0x0070FF).set(95, 0xA335EE).set(99, 0xFF8000).set(100, 0xE5CC80)
			let color
			for (const num of colors.keys()) {
				if(highest.percentile <= num) {
					color = colors.get(num)
					break
				}
			}

			return {
				title: char.name,
				color: color,
				thumbnail: {
					url: char.avatar
				},
				fields: [{
					name: 'Best Performance Average',
					value: `**${avg.toString()}%**`,
					inline: false
				},
				{
					name: 'Best Historical Parse',
					value: `__${highest.encounterName}__ - ${highest.total}  **${highest.percentile}%** (${highest.spec})`,
					inline: false
				},
				{
					name: 'Latest Parses',
					value: latest,
					inline: false
				},
				{
					name: 'Server',
					value: char.server,
					inline: false
				}],
				url: `https://www.fflogs.com/character/id/${highest.characterID}`
			}
		},

		materialPrices(recipe, mats) {
			console.log(recipe)
			let list = '', sum = 0

			for (const mat of mats.values()) {
				list += `**${mat.item.name}**: ${mat.cost ? `${module.exports.decimalCommas(mat.cost)}g *x${mat.num}*` : '???'}\n`
				sum += mat.cost * mat.num
			}

			return {
				title: recipe.name,
				color: 0x5990ff,
				thumbnail: {
					url: recipe.icon
				},
				fields: [{
					name: 'Material Prices',
					value: list,
					inline: false
				},
				{
					name: 'Total Price',
					value: `**__${module.exports.decimalCommas(sum)}__ gil**`,
					inline: false
				}],
				footer: {
					text: 'Prices are taken from market board purchase history and are only roughly indicative.'
				}
			}
		}
	},

	throwError(err, msg) {
		console.error(err)
		msg.util.send(`Something went wrong :(\n\`${err.stack.split('\n').slice(0,2).join('\n')}\``)
	}
}
