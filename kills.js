
if (process.argv.length != 3) {
  console.log('Please specify the full path to a JSON file');
  console.log('e.g.: ./rounds.js ~/input.json');

  process.exit(1);
}

var fs = require('fs');
var d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

if (d.parser_name !== 'ghostanalysis.dem2json' || d.parser_version !== '0.0.1') {
  console.log('Bad JSON version!');
  return;
}

d.events.forEach(function (e) {
  if (e.type === 'player_death') {
    console.log(`${e.payload.attacker_player.steam64_id} killed ${e.payload.player.steam64_id} with ${e.payload.weapon}`);
  }
});
