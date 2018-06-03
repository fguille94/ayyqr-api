var express = require('express');
var router = express.Router();
var con = require('../db');

const SELECT_ALL_USERS_QUERY = "SELECT * FROM user";

router.get('/a/', function (req, res, next) {
  con.getConnection(function (err, db) {
    if (err) throw err;
    db.query(SELECT_ALL_USERS_QUERY, function (err, results) {
      db.release();
      res.json(
        // data: results[0]
        results[0]
      );
      if (err) throw err;
    });
  });
});

router.get('/', function (req, res, next) {
  con.connect(err => {
    if (err) return err;
    con.query(SELECT_ALL_USERS_QUERY, (err, results) => {
      con.end();
      if (err) return err;
      res.json({
        data: results[0]
      });
    });

  });
});

module.exports = router;
