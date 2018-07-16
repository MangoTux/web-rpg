//Game State
gameState = {
	currentCase: 0,

	start:1,

	playerName:2,
	playerRace:2.1,
	playerClass:2.2,

	normal:3,
	goLeft:4,
	goRight:5,
	goDown:6,
	shop:7,

	fight:8,
	dead:9,
};

//Possible races and race stats
playerRace =
{
    human: {
        damage: 6,
        defense: 1,
        health: 30
    },
    elf: {
        damage: 5,
        defense: 1,
        health: 40
    },
    dwarf: {
        damage: 4,
        defense: 2,
        health: 50
    },
    goblin: {
        damage: 5,
        defense: 0,
        health: 45
    }
};

//Possible classes and class stats
playerClasses =
{
    warrior: {
        damage: 2,
        defense: 1,
        health: 5
    },
    ranger: {
        damage: 1,
        defenese: 2,
        health: 4
    },
    mage: {
        damage: 1,
        defense: 1,
        health: 5
    },
    monk: {
        damage: 1,
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
	'Berenthos',
	'Bragi',
	'Brakas',
	'Chelisern',
	'Ciel',
	'Daggard',
	'Erenthar',
	'Farzen',
  'Feanor',
	'Fiend',
	'Fyre',
	'Garoa',
	'Gary',
	'Ghazeer',
	'Goelleniar',
	'Halberd',,
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
	'Meadow',
	'Nallander',
	'Orian',
	'Paladin',
	'Petreuve',
	'Quixor',
	'Ragnarok',
	'Rallian',
	'Starchaser',
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
	'Wind',
	'Wynd',
	'Wrath',
	'Xaradyne',
  'Yavanna',
	'Zerefoss',
	'Zatall'];
