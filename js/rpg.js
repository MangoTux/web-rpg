currentDisplay = "TITLE"; //TITLE, MAP, STATS, SHOP, INVENTORY
var ui, player, combat, encounter, map, item, runTimeout;
const environment = new Environment();
$(window).on('load', $.proxy(function() {
	ui = new UI();
	player = new Player("");
	combat = new Combat();
	encounter = new Encounter();

	Terminal.init();
	Terminal.promptActive = false;
	$('#game').bind('cli-load', function(e)
	{
		$('#game').one('cli-ready', function (e) {});
		Terminal.runCommand('start');
		ui.drawDefaultView();
	});
}, this));
