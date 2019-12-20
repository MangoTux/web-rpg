//Removes leading and trailing spaces from value
function trimInput(value)
{
	if (value)
	{
		var left = /\s*((\S+\s*)*)/;
		value = value.replace(left, '$1');
		var right = /((\s*\S+)*)\s*/;
		value = value.replace(right, '$1');
		return value;
	}
	return '';
}
//Sanitizes the input to remove potentially bad input expressions
function sanitize(str)
{
	str = str.replace(/&/g, '&');
	str = str.replace(/</g, '<');
	str = str.replace(/>/g, '>');
	str = str.replace(/ /g, 'Ã‚ ');
	if (/msie/i.test(navigator.userAgent))
	{
		str = str.replace('\n', '<br/>');
	}
	else
	{
		str = str.replace(/\x0D/g, '<br/>');
	}
	return str;
}

//The terminal shell
//Contains information such as commands, filters, and processing of commands
var TerminalShell =
{
	state: state.terminal.standard,
	commands:
	{
		clear: function()
		{
			Terminal.clear();
		}
	},

	process: function(cmd) {
		try
		{
			//Get the individual arguments, parsed by spaces
			var cmd_args = cmd.split(' ');
			//Get the command name from the input
			var cmd_name = cmd_args.shift();
			cmd_args.unshift();
			//Set the player name to user input
			// Handlers for dynamic commands
			switch (player.state) {
				case state.player.name:
					prompt_name(cmd);
					return;
				case state.player.race:
					prompt_race(cmd);
					return;
				case state.player.archetype:
					prompt_archetype(cmd);
					return;
			}
			//If the entered command is in the elements in command
			if (!this.commands.hasOwnProperty(cmd_name))
			{
				Terminal.print("What?");
				return;
			}

			// Some messages don't have a meaning while dead, so this ignores those actions
			if (player.state == state.player.dead &&
				!['start', 'new', 'help', 'updates', 'about', 'fight', 'run'].includes(cmd_name)) {
					return;
			}
			this.commands[cmd_name].apply(this, cmd_args);
		} catch (e) {
			//Something went horribly, horribly wrong
			Terminal.error('Something happened: ' + e);
			console.log(e);
		}
	}
};

// Everything here could be static.
//Define terminal object for CLI
Terminal=
{
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
	config:
	{
		scrollStep: 20,
		scrollSpeed: 100,
		bg_color:'#000',
		fg_color:'#FFF',
		cursor_blink_time:700,
		cursor_style: 'block',
		prompt:'> ',
		spinnerCharacters:['.','..','...',' '],
		spinnerSpeed: 250,
		typingSpeed:50
	},

	//Initializes the terminal object
	init: function()
	{
		function ifActive(func)
		{
			return function()
			{
				if (Terminal.promptActive)
				{
					func.apply(this, arguments);
				}
			};
		}

		$(document)
			.keypress($.proxy(ifActive(function(e)
			{
				//Get the character that was input - allows letters, numbers, and spaces
				if (e.which >= 32 && e.which <= 126)
				{
					var character = String.fromCharCode(e.which);
				}
				else
				{
					return; //Otherwise, ignore the input
				}

				//If the character was legal, add it to the display
				if (character)
				{
					this.addCharacter(character);
					//Ignore browser-based key shortcuts here
					e.preventDefault();
				}
			}), this))
		//Handles special key functions, and ignores most default operations on the browser
		.bind('keydown', 'return', ifActive(function(e) { Terminal.processInputBuffer(); })) //Enter executes the command
		.bind('keydown', 'backspace', ifActive(function(e) { e.preventDefault(); Terminal.deleteCharacter(e.shiftKey); })) //Backspace deletes character at cursor
		.bind('keydown', 'del', ifActive(function(e) { Terminal.deleteCharacter(true); })) //Del Deletes character at next value
		.bind('keydown', 'left', ifActive(function(e) { e.preventDefault(); })) //Shifts cursor left and right
		.bind('keydown', 'right', ifActive(function(e) { e.preventDefault(); })) //Shifts cursor left and right
		.bind('keydown', 'home', ifActive(function(e) { e.preventDefault(); Terminal.setPos(0); })) //Sets cursor at beginning of line
		.bind('keydown', 'end', ifActive(function(e) { e.preventDefault(); Terminal.setPos(Terminal.buffer.length); })) //Sets cursor at end of line
		.bind('keydown', 'tab', function(e) { e.preventDefault(); }); //No functionality, which is actually good for this.

		//Handles scrolling of window to adjust where everything is placed - FIX THIS
		$(window).resize(function(e) { $('#game').scrollTop($('#game').attr('scrollHeight')); });

		//Disable working until everything is initialized
		this.setCursorState(true);
		this.setWorking(false);
		$('#prompt').html(this.config.prompt);
		$('#game').hide().fadeIn('fast', function() { $('#game').triggerHandler('cli-load'); });
	},

	// No cursor stuff is currently working
	setCursorState: function(state, fromTimeout)
	{
		this.cursorBlinkState = state;
		if (this.config.cursor_style == 'block')
		{
			if (state)
			{
				$('#cursor').css({color:this.config.bg_color, backgroundColor:this.config.fg_color});
			}
			else
			{
				$('#cursor').css({color:this.config.fg_color, background:this.config.bg_color});
			}
		}
		else
		{
			if (state)
			{
				$('#cursor').css('textDecoration', 'underline');
			}
			else
			{
				$('#cursor').css('textDecoration', 'none');
			}
		}

		//Schedule next blink
		if (!fromTimeout && this._cursorBlinkTimeout)
		{
			window.clearTimeout(this._cursorBlinkTimeout);
			this._cursorBlinkTimeout = null;
		}
		this._cursorBlinkTimeout = window.setTimeout($.proxy(function() {
			this.setCursorState(!this.cursorBlinkState, true);
		}, this), this.config.cursor_blink_time);
	},

	// Clears the terminal
	clear: function()
	{
		var displayElement = document.getElementById("display"); // Get the display element
		while (displayElement.firstChild) {
			displayElement.removeChild(displayElement.firstChild);
		}
		this.resetGameInfo();
	},
	resetGameInfo: function()
	{
		ui.drawDefaultView();
	},
	drawTombstone: function()
	{
		ui.drawTombstone();
	},

	//Handles changing the input display to the updated value
	updateInputDisplay: function()
	{
		var left = '', underCursor = ' ', right = '';

		if (this.pos < 0)
		{
			this.pos = 0;
		}
		if (this.pos > this.buffer.length)
		{
			this.pos = this.buffer.length;
		}
		if (this.pos > 0)
		{
			left = this.buffer.substr(0, this.pos);
		}
		if (this.pos < this.buffer.length)
		{
			underCursor = this.buffer.substr(this.pos, 1);
		}
		if (this.buffer.length - this.pos > 1)
		{
			right = this.buffer.substr(this.pos+1, this.buffer.length-this.pos-1);
		}

		$('#lcommand').text(left);
		$('#cursor').text(underCursor);

		$('#rcommand').text(right);
		$('#prompt').text(this.config.prompt);
		return;
	},

	//Clears the input buffer - used for hitting 'enter'
	clearInputBuffer: function()
	{
		this.buffer = '';
		this.pos = 0;
		this.updateInputDisplay();
	},

	//Adds a character, fixing the text to be correct
	addCharacter: function(character)
	{
		var left = this.buffer.substr(0, this.pos);
		var right = this.buffer.substr(this.pos, this.buffer.length-this.pos);
		this.buffer = left + character + right;
		this.pos++;
		this.updateInputDisplay();
		this.setCursorState(true);
	},

	//Deletes a character and fixes the surrounding text
	deleteCharacter: function(forward)
	{
		var offset = forward ? 1 : 0;
		if (this.pos >= (1-offset))
		{
			var left = this.buffer.substr(0, this.pos-1+offset);
			var right = this.buffer.substr(this.pos+offset, this.buffer.length);
			this.buffer = left + right;
			this.pos -= 1 - offset;
			this.updateInputDisplay();
		}
		this.setCursorState(true);
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
		var displayElement = $('#display');
		if (!text)
		{
			displayElement.append($('<div>'));
		} else if (text instanceof jQuery) {
			displayElement.append(text);
		} else {
			if (this.suppressed) return;
			var av = Array.prototype.slice.call(arguments, 0);
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

	processInputBuffer: function(cmd) {
		this.print($('<p>').addClass('command').text(this.config.prompt + this.buffer));
		var cmd = trimInput(this.buffer);
		this.clearInputBuffer();
		if (cmd.length == 0) {
			return false;
		}
		if (!this.output) {
			return false;
		}
		this.setWorking(true);
		let response = this.output.process(cmd.toLowerCase());
		this.setWorking(false);
		return response;
	},

	//Enables the input to be active
	setPromptActive: function(active) {
		this.promptActive = active;
		$('#inputline').toggle(this.promptActive);
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
			$('#game').triggerHandler('cli-busy');
		} else if (!working && this._spinnerTimeout) {
			clearInterval(this._spinnerTimeout);
			this._spinnerTimout = null;
			$('#spinner').fadeOut();
			this.setPromptActive(true);
			$('#game').triggerHandler('cli-ready');
		}
	},

	//Manually enters the command and executes it as if the user had typed it
	runCommand: function(text) {
		var index = 0;
		var mine = false;

		//Disables prompt active for the time being
		this.promptActive = false;
		//Types the character sequence of text
		var interval = window.setInterval($.proxy(function typeCharacter() {
			if (index < text.length)
			{
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
