var express = require('express');
var router = express.Router();
var con = require('../db');
var fs = require('fs');
var randomstring = require("randomstring");
var md5 = require("md5");
var request = require('request');
const qr = require('qr-code-with-logo');
const SELECT_ALL_USERS_QUERY = "SELECT * FROM ticket";


// generate MD5 for ticket
function md5Gen(userName, userId, eventId, eventPurchaseBulk) {
  rng = randomstring.generate(32);
  part1 = md5(userName + userId);
  final = md5(part1 + eventId + eventPurchaseBulk + rng);
  return final;
}

// generate MD5 for each ticket in a purchase
function md5TicketsGen(userName, userId, eventId, eventPurchaseBulk, amount) {
  var ticketBulk = [];
  for (let i = 0; i < amount; i++) {
    ticketBulk.push(md5Gen(userName, userId, eventId, eventPurchaseBulk));
  }
}

function qrImageGen(md5Code) {
  var url = "http://api.qrserver.com/v1/create-qr-code/?size=420x420&data=" + md5Code;
  url += "&charset=UTF-8&charset-target=UTF-8&ecc=M&qzone=2&format=png";
  return url;
}

function qrFileGen(md5Code) {
  request(qrImageGen(md5Code)).pipe(fs.createWriteStream('public/image/' + md5Code + '.png'));
}

function md5TicketGen(md5Code) {

  // request('https://www.google.com/images/srpr/logo11w.png').pipe(fs.createWriteStream('qr.png'));


  // fs.open('aaa.png', 'a', (err, fd) => {
  //   if (err) throw err;
  //   // fs.appendFile(fd, img);
  //   fs.fstat(fd, (err, stat) => {
  //     if (err) throw err;
  //     fs.close(fd, (err) => {
  //       if (err) throw err;
  //     });
  //   });
  // });
}

router.get('/', function (req, res, next) {
  con.getConnection(function (err, db) {
    if (err) throw err;
    db.query(SELECT_ALL_USERS_QUERY, function (err, results) {
      db.release();
      res.json(
        // data: results[1]
        results[0]
      );
      if (err) throw err;
    });
  });
});

router.get('/make', function (req, res, next) {
  // qr.toImage({
  //   content: 'aaa',
  //   width: 300
  //
  // res.send(md5Gen('aa', 1, 2, 3));
  md5TicketGen(
    md5Gen('aa', 1, 2, 3)
  );
  // }).then(_ => console.log('success'));

  fs.open('aaa.txt', 'a', (err, fd) => {
    if (err) throw err;
    fs.fstat(fd, (err, stat) => {
      if (err) throw err;
      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });
  });
});

module.exports = router;
