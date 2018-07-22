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
	commands:
	{
		clear: function(terminal)
		{
			terminal.clear();
		}
	},
	filters: [], //What does this mean?!?

	process: function(terminal, cmd)
	{
		try
		{
			$.each(this.filters, $.proxy(function(index, filter)
			{
				cmd = filter.call(this, terminal, cmd);
			}, this));
			//Get the individual arguments, parsed by spaces
			var cmd_args = cmd.split(' ');
			//Get the command name from the input
			var cmd_name = cmd_args.shift();
			cmd_args.unshift(terminal);
			//Set the player name to user input
			if (gameState.currentCase == gameState.playerName)
			{
				player.name = cmd.charAt(0).toUpperCase() + cmd.slice(1);
				gameState.currentCase = gameState.playerRace;
				terminal.print("Okay, " + player.name + ", what is your race? [Human/Elf/Dwarf/Goblin]");
			}
			 //Process the player's input, and if correct, advance to class query
			else if (gameState.currentCase == gameState.playerRace)
			{
				var race = cmd.toLowerCase();
				//If the input is in the array
				if (playerRaces[race] != undefined)
				{
					//Update character information based on selected values
					player.race = race;
					player.base_combat_stats.damageModifier = playerRaces[race].damageModifier;
					player.base_combat_stats.luck = playerRaces[race].damageModifier;
					player.base_combat_stats.defense = playerRaces[race].defense;
					player.base_combat_stats.maxHP = playerRaces[race].health;

					terminal.print("Okay, what is your class? [Warrior/Ranger/Mage/Monk]");
					gameState.currentCase = gameState.playerClass;
				}
				else //Continue asking until correct input is received
				{
					terminal.print("What is your race? [Human/Elf/Dwarf/Goblin]");
				}
			}
			//Process the player's input, and if correct, start the actual gameplay
			else if (gameState.currentCase == gameState.playerClass)
			{
				var pclass = cmd.toLowerCase();
				//If the input is in the pclass array
				if (playerClasses[pclass] != undefined)
				{
					//Update character information based on selected values
					player.playerClass = pclass;
					player.base_combat_stats.damageRollMax = playerClasses[pclass].damageRollMax;
					player.base_combat_stats.damageRollQty = playerClasses[pclass].damageRollQty;
					player.base_combat_stats.damageModifier += playerClasses[pclass].damageModifier;
					player.base_combat_stats.attackSpeed = playerClasses[pclass].attackSpeed;
					player.base_combat_stats.defense += playerClasses[pclass].defense;
					player.base_combat_stats.maxHP += playerClasses[pclass].health;
					player.inventory.push(new HealthItem());
					player.base_combat_stats.currentHP = player.combat_stats.maxHP;
					terminal.print("Welcome! View the help tab to get started, " + player.name + " the " + player.race + " " + player.playerClass + ".");
					//Set the special case denotion to regular input
					gameState.currentCase = gameState.normal;
				}
			}
			//If the entered command is in the elements in command
			else if (this.commands.hasOwnProperty(cmd_name))
			{
				this.commands[cmd_name].apply(this, cmd_args);
			}
			else
			{
				//If the command is not recognized by any existing commands
				if (!(this.fallback && this.fallback(terminal, cmd)))
				{
					terminal.print('What?');
				}
			}
		}
		catch (e)
		{
			//Something went horribly, horribly wrong
			terminal.print($('<p>').addClass('error').text('Something happened: ' + e));
			console.log(e);
			terminal.setWorking(false);
		}
	}
};
//Define terminal object for CLI interface
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

	output: TerminalShell,

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
		spinnerCharacters:['[   ]','[.  ]','[.. ]','[...]'],
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

	//Deletes the entire word - Is it currently being used?
	deleteWord: function()
	{
        if (this.pos > 0)
		{
            var ncp = this.pos;
			//Iterate through until a space is found
            while (ncp > 0 && this.buffer.charAt(ncp) !== ' ')
			{
                ncp--;
            }
			//Concatenates everything to the left and right of deleted word
            left = this.buffer.substr(0, ncp - 1);
            right = this.buffer.substr(ncp, this.buffer.length - this.pos);
            this.buffer = left + right;
            this.pos = ncp;
            this.updateInputDisplay();
        }
        this.setCursorState(true);
    },

	//Moves the cursor based on arrow key values
    moveCursor: function(val)
	{
        this.setPos(this.pos + val);
    },

	//Sets the position of the cursor
    setPos: function(pos)
	{
        if ((pos >= 0) && (pos <= this.buffer.length))
		{
            this.pos = pos;
            Terminal.updateInputDisplay();
        }
        this.setCursorState(true);
    },

	//Jumps to the bottom of the input display - Should use this for changing anchorpoint
	jumpToBottom: function()
	{
		$('#screen').animate({scrollTop: $('#screen').attr('scrollHeight')}, this.config.scrollSpeed, 'linear');
	},

	removeLines: function(displayElement)
	{
		if (displayElement.find('*').length > 30) // Recursively removes all extra lines - While loop hangs page
		{
			displayElement.children().first().fadeOut(500, function() {
				$(this).remove();
				Terminal.removeLines(displayElement);
			});
		}
	},

	//Prints the given text to the terminal display
	print: function(text)
	{
		var displayElement = $('#display');
		if (!text)
		{
			displayElement.append($('<div>'));
		}
		else if (text instanceof jQuery)
		{
			displayElement.append(text);
		}
		else
		{
			if (this.suppressed) return;
			var av = Array.prototype.slice.call(arguments, 0);
			displayElement.append($('<p>').text(av.join(' ')));
		}
		this.removeLines(displayElement);
		this.jumpToBottom();
	},

	processInputBuffer: function(cmd)
	{
		this.print($('<p>').addClass('command').text(this.config.prompt + this.buffer));
		var cmd = trimInput(this.buffer);
		this.clearInputBuffer();
		if (cmd.length == 0)
		{
			return false;
		}
		if (this.output)
		{
			return this.output.process(this, cmd.toLowerCase());
		}
		else
		{
			return false;
		}
	},

	//Enables the input to be active
	setPromptActive: function(active)
	{
		this.promptActive = active;
		$('#inputline').toggle(this.promptActive);
	},

	//Sets the terminal to allow input/output
	setWorking: function(working)
	{
		if (working && !this._spinnerTimemout)
		{
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
		}
		else if (!working && this._spinnerTimeout)
		{
			clearInterval(this._spinnerTimeout);
			this._spinnerTimout = null;
			$('#spinner').fadeOut();
			this.setPromptActive(true);
			$('#game').triggerHandler('cli-ready');
		}
	},

	//Manually enters the command and executes it as if the user had typed it
	runCommand: function(text)
	{
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
			}
			else
			{
				clearInterval(interval);
				this.promptActive = true;
				this.processInputBuffer('');
			}
		}, this), this.config.typingSpeed);
	}
}
