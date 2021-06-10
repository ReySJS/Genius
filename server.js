const express = require('express');
const app = express();
const bodyParser = require("body-parser");

let ranking = [{
  "player": "Lagartixa Banguela",
  "step": "22",
  "time": "07:15.76"
}, {
  "player": "Lesma Veloz",
  "step": "23",
  "time": "07:15.76"
},
{
  "player": "Mosca Manca",
  "step": "23",
  "time": "07:15.75"
}, {
  "player": "Bill Gates",
  "step": "30",
  "time": "12:43.75"
}, {
  "player": "Rato Gato",
  "step": "19",
  "time": "05:15.75"
}, {
  "player": "Porco Limpo",
  "step": "15",
  "time": "04:15.75"
}, {
  "player": "Nuricel",
  "step": "100",
  "time": "01:15.75"
}]

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('public'));

app.get('/ranking/all', (req, res) => {

  const id = req.params.id;
  return res.json(ranking);
});

app.post('/ranking', (req, res) => {

  player = req.body.player;
  step = req.body.step;
  time = req.body.time;

  ranking.push(
    {
      "player": player,
      "step": step,
      "time": time,
    });
  res.json(ranking);
});

app.listen(80);