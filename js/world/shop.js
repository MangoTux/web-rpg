class Shop {
	name;
	inventory = [];
	max_stock = 5;

	constructor() {
		this.name = new MName().New() + "'s Shop";
	}

	restock() {
		for (let i = this.inventory.length; i<this.max_stock; i++) {
			// Eventually, certain shops will be predisposed to weapons, consumables, etc
			this.inventory.push(ItemFactory.getRandomItem());
		}
	}
}
