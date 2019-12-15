var Shop = function(player)
{
	this.X = player.X;
	this.Y = player.Y;
	this.inventory = []; // No stock right now
	this.name = new MName().New() + "'s shop";
	this.init = function()
	{
		this.inventory.push(new HealthItem());
		this.inventory.push(new HealthItem());
		this.inventory.push(new Item());
		this.inventory.push(new Item());
		this.inventory.push(Math.random()<.7?new Item():new HealthItem());
	}
}

function restock()
{
	// Restocks the shop
	for (var i = shopList[currentShopIndex].shop.inventory.length; i < 5; i++)
	{
        var x = Math.random();
        if (x < 0.6)
            shopList[currentShopIndex].shop.inventory.push(new Item());
        else if (x < 0.9)
            shopList[currentShopIndex].shop.inventory.push(new HealthItem());
        else
            shopList[currentShopIndex].shop.inventory.push(new ToolItem());
	}
}

function displayShopInfo()
{
	var shopInv = $('<ul>');
	for (i = 0; i<5; i++)
	{
		if (i >= shopList[currentShopIndex].shop.inventory.length)
			shopInv.append($('<li>').html("Out of stock!<br>   Please visit later."));
		else
			shopInv.append($('<li>').html(shopList[currentShopIndex].shop.inventory[i].name + "<br>   Price: " + shopList[currentShopIndex].shop.inventory[i].cost + " gold."));
	}
	$('#gameInfo').html("<h3>" + shopList[currentShopIndex].shop.name + "</h3><ul>" + shopInv.html() + "</ul><br><br>You have: " + player.gold + " gold.");
}

// List of shops - 1000-1500 seems to be a good distribution
var shopList = [];
for (var i=0; i<=1500; i++)
{
    shopList.push({x:getRandomInt(-500, 500), y:getRandomInt(-500, 500), shop:null});
}
var currentShopIndex;
