rpg the rpg Stat Design
=============

Overview
--------

Following many other RPG systems, each type of character (see: Archetypes)
will have a distribution of stats that are best-suited to their effectiveness
in combat.

Power
--------
How hard you hit with weapon attacks.

Vitality
--------
How much health you have.

Resilience
----------
Durability of the character. Plays a role in base damage reduction, factoring in armor boosts

Dexterity
---------
How accurate your attacks are.

Spirit
------
How effective spells and divine powers are (Items that require a focus)

Luck
----
Essentially, how lucky the character is. Higher luck influences crit rate (and crit count), dodge chance.

Calculations (WIP)
------------------

A Source hitting a Target is a function of the following:
Source:
- Dexterity (Base, Racial+Archetype, Item boosts)
- Luck
- Move Accuracy
- Passive Effects
- Active Abilities
Target:
- Luck
- Passive Effects
- Active Abilities

Damage delivered by a Source to a Target is a function of the following:
Source:
- Power (Base, Racial+Archetype, Item boosts)/Spirit (If Magic)
- Move power
- Passive Effects
- Active Abilities
Target:
- Resilience
- Passive Effects
- Active Abilities

Damage taken is reduced from the target's Health Pool, calculated using Vitality + any temporary buffers
