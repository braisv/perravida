var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./db/chinook.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  var sqlQuery = `SELECT * FROM Users`;

  db.query(sqlQuery, function (err, results, fields) {
    console.log({ results })

    res.render('index', {
      title: 'Register - Login',
      authorised: req.session.authorised,
      fname: req.session.fname,
      users: results
    });

  });
  //res.send('Hello world!');
});

module.exports = router;


function processData(res, sql){
  db.serialize(function() {
    db.all(sql, 
      function(err, rows) {
        if(err){
          console.error(err);
          res.status(500).send(err);
        }
        else
          sendData(res, rows, err);
    });
  });
}