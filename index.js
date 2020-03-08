const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/sendData', (req, res) => {
    let name = req.body.name;
    let score = req.body.score;
    fs.readFile('rating.json', (err, data) => {
        if (err) throw err;
        let json = JSON.parse(data);
        json[name] = score;
        json = [...json];
        let final = JSON.stringify(json);
        fs.writeFile('rating.json', final, (err) => {
            if (err) throw err;
            res.send('done');
        });
    });

});

app.listen(process.env.PORT || 5000);