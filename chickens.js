
if (process.argv.length != 3) {
  console.log('Please specify the full path to a JSON file');
  console.log('e.g.: ./rounds.js ~/input.json');

  process.exit(1);
}

var fs = require('fs');
var d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

if (d.parser_name !== 'ghostanalysis.dem2json-events' || d.parser_version !== '0.0.x-dev') {
  console.log('Bad JSON version!');
  process.exit(1);
}

d.events.forEach(function (e) {
  if (e.type === 'other_death') {
    console.log(`${e.player.name} killed 🐓 from ${e.player.place} with ${e.weapon}.`);
  }
});
