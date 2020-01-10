let basic_punch = new Attack("Basic Punch", "A basic punch", 1);
basic_punch.accuracy = 0.9;
basic_punch.damage_bounds = [
  () => player.level,
  () => player.level+2
];
ActionCatalog.catalog['basic_punch'] = basic_punch;

let basic_kick = new Attack("Basic Kick", "A basic kick", 1);
basic_kick.accuracy = 0.8;
basic_kick.damage_bounds = [
  2,
  () => player.level+2
];
basic_kick.critical_modifier = +2;
basic_kick.onMiss = () => {
  console.log("kick and a miss");
}
ActionCatalog.catalog['basic_kick'] = basic_kick;

let basic_stab = new Attack("Basic Stab", "A basic stab", 1);
basic_punch.accuracy = 0.7;
basic_kick.critical_modifier = +4;
basic_punch.damage_bounds = [
  () => player.level,
  () => player.level+2
];
ActionCatalog.catalog['basic_stab'] = basic_stab;

let basic_bolt = new Attack("Basic Bolt", "A basic magical bolt", 1);
basic_bolt.accuracy = 999;
basic_kick.damage_bounds = [
  () => player.level,
  () => player.level,
];
ActionCatalog.catalog['basic_bolt'] = basic_bolt;


let flurry_of_blows = new Attack("Flurry of Blows", "Three quick attacks", 5);
flurry_of_blows.accuracy = 0.5;
flurry_of_blows.hit_count = 3;
flurry_of_blows.damage_bounds = [
  () => player.level,
  () => player.level
];
flurry_of_blows.onBeforeHit = () => { this.hit_counter = 0; }
flurry_of_blows.onHit = () => { this.hit_counter++; }
flurry_of_blows.onEnd = () => { if (this.hit_counter == this.hit_count) console.log("Knock the target prone"); }
ActionCatalog.catalog['flurry_of_blows'] = flurry_of_blows;
