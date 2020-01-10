Terminal = {
	buffer: '',
	pos: 0,
	promptActive: true,
	suppressed: false,
	cursorBlinkState: true,
	_cursorBlinkTimeout: null,
	spinnerIndex: 0,
	_spinnerTimeout: null,

	output: Shell,

	//Configuration for graphic interface
	config: {
		scrollStep: 20,
		scrollSpeed: 100,
		bg_color:'#000',
		fg_color:'#FFF',
		prompt:'> ',
		spinnerCharacters:[' ', '.','..','...'],
		spinnerSpeed: 250,
		typingSpeed:50
	},

	selector: {
		cli: "#cli",
		history: "#history",
		input: "#input",
		hud_main: "#hud_main",
		hud_combat: "#hud_combat",
		combat: { // Everything here is missing the primary component, since I'm dropping these in templates.
			wrapper: "combat_wrapper", // Class
			ally: "combat_ally", // ID
			center: "combat_center", // ID
			enemy: "combat_enemy", // ID
			name: "combat_name", // Class
			hp: {
				wrapper: "combat_hp", // Class
				now: "hp_now", // Class
				max: "hp_max", // Class
				buffer:"hp_buffer",
			},
		},
	},

	//Initializes the terminal object
	init: function() {
		function ifActive(func)
		{
			return function() { Terminal.promptActive && func.apply(this, arguments);}
		}

		$(document)
		.keypress($.proxy(ifActive(function(e) {
			//Get the character that was input - allows letters, numbers, and spaces
			if (e.which < 32 || 126 < e.which) {
				return;
			}
			Terminal.addCharacter(String.fromCharCode(e.which));
			e.preventDefault();
		}), this))
		//Handles special key functions, and ignores most default operations on the browser
		.bind('keydown', 'return', ifActive(function(e) { Terminal.processInputBuffer(); })) //Enter executes the command
		.bind('keydown', 'backspace', ifActive(function(e) { e.preventDefault(); Terminal.deleteCharacter(); })) //Backspace deletes character at cursor
		.bind('keydown', 'left', ifActive(function(e) { e.preventDefault(); })) //Shifts cursor left and right
		.bind('keydown', 'right', ifActive(function(e) { e.preventDefault(); })) //Shifts cursor left and right
		.bind('keydown', 'tab', function(e) { e.preventDefault(); }); //No functionality, which is actually good for this.

		//Handles scrolling of window to adjust where everything is placed - FIX THIS
		$(window).resize(function(e) { $(Terminal.selector.cli).scrollTop($(Terminal.selector.cli).attr('scrollHeight')); });

		//Disable working until everything is initialized
		this.setWorking(false);
		$('#prompt').html(this.config.prompt);
		$(Terminal.selector.cli).hide().fadeIn('fast', function() { $(Terminal.selector.cli).triggerHandler('cli-load'); });
	},

	// Clears the terminal
	clear: function()
	{
		const displayElement = document.querySelector(Terminal.selector.history); // Get the display element
		while (displayElement.firstChild) {
			displayElement.removeChild(displayElement.firstChild);
		}
		this.resetGameInfo();
	},

	resetGameInfo: function() {
		ui.drawDefaultView();
	},

	drawTombstone: function()	{
		ui.drawTombstone();
	},

	//Handles changing the input display to the updated value
	updateInputDisplay: function() {
		let left = '', underCursor = ' ', right = '';

		if (this.pos < 0) {
			this.pos = 0;
		}
		if (this.pos > this.buffer.length) {
			this.pos = this.buffer.length;
		}
		if (this.pos > 0) {
			left = this.buffer.substr(0, this.pos);
		}
		if (this.pos < this.buffer.length) {
			underCursor = this.buffer.substr(this.pos, 1);
		}
		if (this.buffer.length - this.pos > 1) {
			right = this.buffer.substr(this.pos+1, this.buffer.length-this.pos-1);
		}

		$('#lcommand').text(left);
		$('#cursor').text(underCursor);

		$('#rcommand').text(right);
		$('#prompt').text(this.config.prompt);
		return;
	},

	//Clears the input buffer - used for hitting 'enter'
	clearInputBuffer: function() {
		this.buffer = '';
		this.pos = 0;
		this.updateInputDisplay();
	},

	//Adds a character, fixing the text to be correct
	addCharacter: function(character)	{
		let left = this.buffer.substr(0, this.pos);
		let right = this.buffer.substr(this.pos, this.buffer.length-this.pos);
		this.buffer = left + character + right;
		this.pos++;
		this.updateInputDisplay();
	},

	//Deletes a character and fixes the surrounding text
	deleteCharacter: function() {
		let offset = 0;
		if (this.pos < 1) { return; }
		let left = this.buffer.substr(0, this.pos-1);
		let right = this.buffer.substr(this.pos, this.buffer.length);
		this.buffer = left + right;
		this.pos--;
		this.updateInputDisplay();
	},


	//Jumps to the bottom of the input display - Should use this for changing anchorpoint
	jumpToBottom: function() {
		$('#screen').animate({scrollTop: $('#screen').attr('scrollHeight')}, this.config.scrollSpeed, 'linear');
	},

	removeLines: function(displayElement) {
		// TODO apply a timestamp in combination with count
		if (displayElement.find('*').length < 30) { // Recursively removes all extra lines - While loop hangs page
			return;
		}
		displayElement.children().first().fadeOut(500, function() {
			$(this).remove();
			Terminal.removeLines(displayElement);
		});
	},

	//Prints the given text to the terminal display
	print: function(text) {
		let displayElement = $(Terminal.selector.history);
		if (!text)
		{
			displayElement.append($('<div>'));
		} else if (text instanceof jQuery) {
			displayElement.append(text);
		} else {
			if (this.suppressed) return;
			let av = Array.prototype.slice.call(arguments, 0);
			displayElement.append($('<p>').text(av.join(' ')));
		}
		this.removeLines(displayElement);
		this.jumpToBottom();
	},

	success: function(text) {
		this.print($('<p>').addClass('success').text(text));
	},

	error: function(text) {
		this.print($('<p>').addClass('error').text(text));
	},

	trimBuffer: function()	{
		if (!this.buffer) { return ''; }
		this.buffer = this.buffer
		.replace(/\s*((\S+\s*)*)/, '$1')
		.replace(/((\s*\S+)*)\s*/, '$1');
	},

	processInputBuffer: function() {
		this.print($('<p>').addClass('command').text(this.config.prompt + this.buffer));
		this.trimBuffer();
		let cmd = this.buffer;
		this.clearInputBuffer();
		if (cmd.length == 0) {
			return false;
		}
		if (!this.output) {
			return false;
		}
		let response = this.output.process(cmd.toLowerCase());
		return response;
	},

	//Enables the input to be active
	setPromptActive: function(active) {
		this.promptActive = active;
		$('#prompt').toggle(this.promptActive);
	},

	//Sets the terminal to allow input/output
	setWorking: function(working) {
		if (working && !this._spinnerTimemout) {
			$('#display .command:last-child').add('#bottomline').first().append($('#spinner'));
			this._spinnerTimeout = window.setInterval($.proxy(function() {
				if (!$('#spinner').is(':visible'))
				{
					$('#spinner').fadeIn();
				}
				this.spinnerIndex = (this.spinnerIndex + 1) % this.config.spinnerCharacters.length;
				$('#spinner').text(this.config.spinnerCharacters[this.spinnerIndex]);
			}, this), this.config.spinnerSpeed);
			this.setPromptActive(false);
			$(Terminal.selector.cli).triggerHandler('cli-busy');
		} else if (!working && this._spinnerTimeout) {
			clearInterval(this._spinnerTimeout);
			this._spinnerTimout = null;
			$('#spinner').fadeOut(400, () => {this.setPromptActive(true)});
			this.setPromptActive(true);
			$(Terminal.selector.cli).triggerHandler('cli-ready');
		}
	},

	//Manually enters the command and executes it as if the user had typed it
	runCommand: function(text) {
		let index = 0;
		let mine = false;
		//Disables prompt active for the time being
		this.promptActive = false;
		//Types the character sequence of text
		let interval = window.setInterval($.proxy(function typeCharacter() {
			if (index < text.length) {
				this.addCharacter(text.charAt(index));
				index += 1;
			} else {
				clearInterval(interval);
				this.promptActive = true;
				this.processInputBuffer('');
			}
		}, this), this.config.typingSpeed);
	},

	processArgs: function(text) {
		let cmd_args = Array.prototype.slice.call(text);
		return cmd_args.shift();
	}
}
