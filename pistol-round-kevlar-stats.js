/* Calculate whether kevlar was a waste of money for pistol rounds
 *
 * We need to track a few things for this
 * - is it pistol round?
 * - maybe if people had kevlar?
 * - if the person got headshot?
 */

if (process.argv.length != 3) {
  console.log('Please specify the full path to a JSON file');
  console.log('e.g.: ./rounds.js ~/input.json');

  process.exit(1);
}

var fs = require('fs');
var d = require('./' + process.argv[2]);

if (d.parser_name !== 'ghostanalysis.dem2json-events' || d.parser_version !== '0.0.x-dev') {
  console.log('Bad JSON version!');
  process.exit(1);
}

let roundNum;
let pistolRound = false;
let players_with_kevlar = {};
let players_that_got_headshot = {};

d.events.forEach(function (e) {
  if (e.type === 'round_start' || e.type === 'round_freeze_end') {
    if (e.round !== roundNum) {
      roundNum = e.round;
      if ((roundNum < 30) && ((roundNum - 1) % 15 == 0)) {
        pistolRound = true;
        players_with_kevlar = {};
      } else {
        pistolRound = false;
        players_with_kevlar = {};
      }
    }
  }

  if (pistolRound) {
    if (e.type === 'item_pickup' && e.item === 'vest') {
      // console.log(`${roundNum}: ${e.player.name} picked up a ${e.item}`)
      players_with_kevlar[e.player.steam64_id] = true;
    }

    if (e.type === 'player_hurt') {
      // Don't bother if there's no attacker player
      if (!e.attacker_player) {
        return;
      }
      if (e.hitgroup === 1) {
        // console.log(`${e.player.name} took ${e.dmg_health} HP damage from a headshot. (health=${e.health} (armor=${e.player.armor}))`)
        players_that_got_headshot[e.player.steam64_id] = true;
      }
    }
    if (e.type === 'player_death') {
      // Don't bother if there's no attacker player
      if (!e.attacker_player) {
        return;
      }

      if (e.headshot === true) {
        if (players_with_kevlar[e.player.steam64_id] !== undefined) {
          // console.log(`${roundNum}: ${e.player.name} died to a headshot, so didn't need kevlar`)
          console.log(`${e.player.name}, 1, 0`)
        }
      } else if (players_that_got_headshot[e.player.steam64_id] !== undefined) {
          // console.log(`${roundNum}: ${e.player.name} died, and took a headshot earlier in the round, so maybe didn't need kevlar`)
          console.log(`${e.player.name}, 0, 1`)
      }
    }
  }
});
