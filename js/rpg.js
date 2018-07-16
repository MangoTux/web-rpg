function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max-min+1))+min;
}
function randomChoice(items)
{
	return items[getRandomInt(0, items.length-1)];
}

currentDisplay = "TITLE"; //TITLE, MAP, STATS, SHOP, INVENTORY
$(document).ready(function() 
{
	Terminal.init();
	Terminal.promptActive = false;
	
	$('#game').bind('cli-load', function(e) 
	{
		$('#game').one('cli-ready', function (e) 
		{});
	
		Terminal.runCommand('start');
	});
});

var item;
var runTimeout;
var player = new Player("");
var map = new Map(0);
if (map.getTile(player.X, player.Y).type == "W")
{
    player.inventory.push(new ToolItem()); //hack hack hack
}