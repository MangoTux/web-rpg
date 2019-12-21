var ui;
var combat;
var player;
var map;
currentDisplay = "TITLE"; //TITLE, MAP, STATS, SHOP, INVENTORY
$(document).ready(function()
{
	Terminal.init();
	Terminal.promptActive = false;
	ui = new UI();
	combat = new Combat();
	player = new Player("");
	encounter = new Encounter();
	$('#game').bind('cli-load', function(e)
	{
		$('#game').one('cli-ready', function (e)
		{});

		Terminal.runCommand('start');
		ui.drawDefaultView();
	});
});

var item;
var runTimeout;
