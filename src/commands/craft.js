const { Command } = require('discord-akairo')

class CraftCommand extends Command {
	constructor() {
		super('craft', {
			aliases: ['craft', 'recipe'],
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
		//find recipe (search and data)

		try {
			msg.channel.startTyping()
			//search
			let res = await this.client.xiv.search(input, {indexes: 'Recipe'})
			if(!res.results.length) {
				msg.util.send('Recipe not found :(')
				return msg.channel.stopTyping()
			}

			//try to use perfect match first
			let found = res.results.find(result => result.name.toLowerCase() === input.toLowerCase())
			let recipe = found ? found : res.results[0]

			//prompt confirm
			if(!found) {
				let embed = this.client.utils.toEmbed.recipeFromSearch(recipe)
				msg.channel.stopTyping()
				let m = await msg.util.send('Is this the recipe you\'re looking for?', {embed:embed})
				let r = await this.client.utils.promptReaction(m, msg.author.id, ['✅','❌'])
				if(!r) return
				if(r.emoji.name === '❌') {
					return msg.util.send('lol idc :3c')
				} else if(r.emoji.name === '✅') {
					msg.channel.startTyping()
				}
			}

			//get recipe and check every amount_ingredientX and item_ingredientX
			recipe = await this.client.xiv.data.get('recipe', recipe.id)
			let list = await getIngredientList(recipe)
			if(!list.hasRecipes) {//simple recipe
				const embed = this.client.utils.toEmbed.recipe(recipe, list.mats)
				let m = await msg.channel.send('', {embed: embed})
				msg.channel.stopTyping()
				return promptPriceCheck(m, msg, this.client, list.mats, recipe)
			}


			//complex recipe, run recursively
			let fullList = await getIngredientList(recipe, true, this.client.xiv)
			const embed = this.client.utils.toEmbed.recipe(recipe, list.mats, fullList)
			let m = await msg.channel.send('', {embed: embed})
			msg.channel.stopTyping()
			return promptPriceCheck(m, msg, this.client, fullList.mats, recipe)
		} catch(err) {
			this.client.utils.throwError(err,msg)
			return msg.channel.stopTyping()
		}

	}
}

async function getIngredientList(recipe, recursive = false, xiv, context = {mats: new Map(), recipes: []}, multiples = 1) {
	return new Promise(async (resolve) => {
		let hasRecipes = false
		for (let i = 0; i < 10; i++) {
			let num = recipe['amount_ingredient'+i], item = recipe['item_ingredient'+i], rec = recipe['item_ingredient_recipe'+i], mult = multiples
			if(num) {
				if(context.mats.has(item.id)) {//already seen
					let temp = context.mats.get(item.id)
					temp.num += num * mult
					context.mats.set(item.id, temp)
				}
				else if(!recursive || !rec) {//not seen, first pass or not recipe
					context.mats.set(item.id, {item: item, num: num * mult})
					if(!recursive && rec)
						hasRecipes = true
				}

				else if(rec) {//not seen, recursive, or recipe
					context.recipes.push(rec[0])
					let fetchedRec = await xiv.data.get('recipe', rec[0].id)
					let factor = mult * num / rec[0].amount_result
					mult = factor < 1 ? 1 : factor
					let res = await getIngredientList(fetchedRec, true, xiv, context, mult)
					context.mats = res.mats
					context.recipes = res.recipes
				}
			}
		}
		resolve({mats: context.mats, recipes: context.recipes, hasRecipes: hasRecipes})
	})
}

function promptPriceCheck(m, msg, client, mats, recipe) {
	return new Promise(async resolve => {
		let r = await client.utils.promptReaction(m, msg.author.id, ['🔍'])
		if(!r) return
		msg.channel.startTyping()
		for(const id of mats.keys()) {//add last sale price to mats
			let res = await client.xiv.market.get(id, {servers: client.config.xiv.server, max_history: 1})
			let temp = mats.get(id)
			temp.cost = res.history.length ? res.history[0].price_per_unit : null
			mats.set(id, temp)
		}
		const embed = client.utils.toEmbed.materialPrices(recipe, mats)
		msg.channel.send('', {embed: embed})
		resolve(msg.channel.stopTyping())
	})
}

module.exports = CraftCommand
