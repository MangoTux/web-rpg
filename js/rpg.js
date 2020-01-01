currentDisplay = "TITLE"; //TITLE, MAP, STATS, SHOP, INVENTORY
var ui, player, map, item, runTimeout;
const environment = new Environment();
$(window).on('load', $.proxy(function() {
	ui = new UI();
	player = new Player("");

	Terminal.init();
	Terminal.promptActive = false;
	$(Terminal.selector.cli).bind('cli-load', function(e)
	{
		$(Terminal.selector.cli).one('cli-ready', function (e) {});
		Terminal.runCommand('start');
		ui.drawDefaultView();
	});
}, this));
