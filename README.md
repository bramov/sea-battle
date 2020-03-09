# sea-battle
Simple interface for the famous "Sea Battle" game

Too bored to write beatiful explanation, sorry. Maybe later.

You can check this game out by clicking the link below.
https://seabattles.herokuapp.com/

Please keep in mind that this project doesn't have DataBase, that's why due to Heroku settings the rating system is being wiped every 30 minutes after the last visit.

Main files: 
- index.js - server on Node with Express, also simply response to GET and POST requests.
- script.js - main logic and events
- gameOptions.js - game settings (not included in script.js because otherwise people could cheat by typing 'game.shot = 10000' in console)
- rating.json - file that is loaded with GET and then send with POST request
