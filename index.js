var app     = require('express')();
var md5     = require('md5');
const port  = process.env.PORT || 1337;
const mysql = require('mysql');
let bodyParser = require('body-parser');
let multer  = require('multer'); // v1.0.5
let upload  = multer(); // for parsing multipart/form-data

let con = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'ayyqr'
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// POST /login gets urlencoded bodies
app.post('/login', upload.array(), function (req, res, next) {
    if (req.body.loginB && req.body.username && req.body.password) {
        console.log('Server request:');
        console.log(req.body);
        console.log(md5("asd"));
        console.log('Server response:');
        con.getConnection(function (err, conx) {
            conx.query("SELECT * FROM users WHERE " +
                        "username='" + req.body.username + "'" +
                        " AND " +
                        "password='" + md5(req.body.password) + "'"
                        , function (err, rows) {
                if (err) throw err;
                conx.release();
                console.log('Results:', rows.length);
                console.log(JSON.stringify(rows));
                // console.log(res.json(rows));
                // res.send(JSON.stringify(rows.username));
                /*
                res.json(rows);
                */
                // /*
                res.json({
                    uname: rows[0].username,
                    login: true
                    // rows
                });
                // */
            });
        });
        // res.json({success: true});

    } else
        res.json({success: false});
});

/*
app.post('/api/users/signup', function (req, res) {
    con.getConnection(function (err, conx) {
        conx.query("SELECT * FROM users WHERE fname=2", function (err, rows) {
        // conx.query("INSERT INTO users (username) VALUES ('a')", function (err, rows) {
            conx.release();
            if (err) throw err;
            console.log(req.body.username);
            console.log('Field count:', rows.fieldCount);
            console.log('Affected rows:', rows.affectedRows);
            console.log('Changed rows:', rows.changedRows);
            console.log('Insert ID:', rows.insertId);
            console.log('Server status:', rows.serverStatus);
            console.log('Warning count:', rows.warningCount);
            console.log('Message:', rows.message);
            console.log('Protocol 41:', rows.protocol41);


            console.log(JSON.stringify(rows));
            res.send(JSON.stringify(rows));
        });
    });
});
*/
app.get('/api/users', function (req, res) {
    con.getConnection(function (err, conx) {
        conx.query("SELECT * FROM users", function (err, rows) {
            conx.release();
            if (err) throw err;
            console.log('Results:', rows.length);
            console.log(JSON.stringify(rows));
            // console.log(res.json(rows));
            // res.send(JSON.stringify(rows));
            res.json(rows);
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
