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
var path = require('path');
var d = require('./' + process.argv[2]);

if (d.parser_name !== 'ghostanalysis.dem2json-events' || d.parser_version !== '0.0.x-dev') {
  console.log('Bad JSON version!');
  process.exit(1);
}

let roundNum;
let overtime = false;
let postPistolRoundCount = 0;
let times = 0;
let winners = {};

d.events.forEach(function (e) {
  if (e.type === 'round_start' || e.type === 'round_freeze_end') {
    if (e.round !== roundNum) {
      roundNum = e.round;
      if (roundNum === 0) {
        times = 0;
      }
      if (e.round > 30) {
        overtime = true
      }
      postPistolRoundCount = (roundNum - 1) % 15
      if (postPistolRoundCount == 0) {
        winners = {};
      }
    }
  }
  if (e.type === 'round_end') {
    if (!overtime && postPistolRoundCount < 3) {
      // console.log(e.winner);
      if (winners[e.winner] == undefined) {
        winners[e.winner] = 0;
      }
      winners[e.winner] += 1;
      if (postPistolRoundCount == 2) {
        for (const [team, wins] of Object.entries(winners)) {
          if (wins == 3) {
            times++;
          }
        }
      }
    }
  }
});

console.log(`${path.basename(process.argv[2], '.json')}, ${times}`);
