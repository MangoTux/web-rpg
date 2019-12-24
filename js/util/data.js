
state = {
	player: {
		start: 1,
		name: 2,
		race: 2.1,
		archetype: 2.2,

		standard: 3,
		underground: 4,
		fight: 5,  // The player has encountered a fight, and needs to choose what to do
		combat: 6, // The player is in the middle of a fight
		shop: 7,   // The player is in a shop

		dead: 0
	},
	shell: {
		standard: 0,
		direction_left: 1,
		direction_right: 2,
	},
	terminal: {
		suppressed: 0,
		standard: 1,
	},
};

//Possible races and race stats
playerRaces =
{
    human: {
        luck: 4,
				damageModifier: 2,
        defense: 1,
        health: 35
    },
    elf: {
        luck: 1,
				damageModifier: 1,
        defense: 2,
        health: 40
    },
    dwarf: {
        luck: 0,
				damageModifier: 2,
        defense: 2,
        health: 50
    },
    goblin: {
        luck: 3,
				damageModifier: 3,
        defense: 0,
        health: 45
    }
};

//Possible classes and class stats
playerClasses =
{
    warrior: {
        damageRollMax: 5,
				damageRollQty: 1,
				damageModifier: 3,
				attackSpeed: 1,
        defense: 3,
        health: 6
    },
    ranger: {
        damageRollMax: 2,
				damageRollQty: 2,
				damageModifier: 1,
				attackSpeed: 1,
        defense: 2,
        health: 5
    },
    mage: {
        damageRollMax: 2,
				damageRollQty: 4,
				damageModifier: 1,
				attackSpeed: 1,
        defense: 1,
        health: 4
    },
    monk: {
        damageRollMax: 2,
				damageRollQty: 1,
				damageModifier: 0,
				attackSpeed: 2,
        defense: 2,
        health: 5
    }
};

namingTemplate =
[
	'Amaryll',
	'Ancient',
	'Arendall',
	'Arenia',
	'Asaru',
	'Aura', //aura aura aura aura aura aura aura
  'Aule',
	'Avian',
	'Bannove',
	'Berenthos',
	'Birgol',
	'Bragi',
	'Brakas',
	'Chelisern',
	'Ciel',
	'Daenan',
	'Daggard',
	'Darora',
	'Erenthar',
	'Faera',
	'Farren',
	'Farzen',
  'Feanor',
	'Fiend',
	'Fyre',
	'Garoa',
	'Gary',
	'Ghazeer',
	'Goelleniar',
	'Grinrune',
	'Halberd',
	'Hemdallr',
	'Ifris',
	'Igneous',
	'Iruzia',
	'Javon',
	'Javallyne',
	'Jormust',
	'Kazahn',
	'Krennemoor',
	'Lavallyam',
	'Luminous',
  'Manwe',
	'Mahuta',
	'Marsh',
	'Meadow',
	'Midna',
	'Nallander',
	'Orian',
	'Paladin',
	'Petreuve',
	'Quixor',
	'Ragnarok',
	'Rallian',
	'Roren',
	'Sera',
	'Shao',
	'Starchaser',
	'Sumorel',
	'Tanfanna',
	'Tempest',
	'Trallos',
	'Samarik',
	'Sanctuary',
	'Saria',
	'Solaris',
	'Ugori',
	'Ulyntos',
	'Valor',
	'Vastorn',
	'Woodruff',
	'Wind',
	'Wynd',
	'Wrath',
	'Xaradyne',
  'Yavanna',
	'Zerefoss',
	'Zatall'];