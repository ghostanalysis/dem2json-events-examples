
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

let lastDeath = null;
d.events.forEach(function (e) {
  if (e.type === 'round_start') {
    lastDeath = null;
  }

  if (e.type === 'player_death') {
    // Don't bother if there's no attacker player
    if (!e.attacker_player) {
      return;
    }

    if (lastDeath) {
      let thisDeath = e;
      // Is the person being killed the one who killed last?
      if (thisDeath.player.steam64_id == lastDeath.attacker_player.steam64_id) {
        let timeDiff = thisDeath.time - lastDeath.time;

        let output = `${thisDeath.player.name} was traded by ${thisDeath.attacker_player.name} ${timeDiff}`;
        output += ` seconds after killing ${lastDeath.player.name}`;

        /* CSV output
        let output = [ thisDeath.player.name, thisDeath.attacker_player.name, timeDiff, lastDeath.player.name, ].join(',');
        */
        console.log(output);
      }
    }

    lastDeath = e;
  }
});
