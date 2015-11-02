var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('orchestrate')("9fccc318-95fc-4295-b4e5-4c49fc8d679a");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dirty Stats' });
});

router.get('/mercs', function(req, res, next){
  db.list('mercs',{limit:17})
  .then(function(result){
    var data = result.body.results;
    var mapped = data.map(function (element, index){
      return {
        id:element.path.key,
        mercName:element.value.mercName,
        class:element.value.class,
        kills: element.value.kills,
        deaths: element.value.deaths,
        score: element.value.score,
        time: element.value.time
      };
    });
    res.send(mapped);
  });
});

router.put("/mercs/:id", function(req, res){
  var id = req.params.id
  db.put("mercs", id, {
    "score":req.body.score,
    "kills": req.body.kills,
    "deaths": req.body.deaths,
    "time":req.body.time,
    "mercName":req.body.mercName,
    "class":req.body.class
   })
  .then(function(result){
    console.log("merc updated");
  });
});

module.exports = router;
