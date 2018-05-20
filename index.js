var app     = require('express')();
var md5     = require('md5');
const port  = process.env.PORT || 1337;
const mysql = require('mysql');
let bodyParser = require('body-parser');
let multer  = require('multer'); // v1.0.5
let upload  = multer(); // for parsing multipart/form-data
var cors = require('cors')
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

let con = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : '192.168.1.120',
    user            : 'root',
    password        : '',
    database        : 'prettyafDB'
    // database        : process.env.DB_NAME
});

log(process.env.PORT);

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

function log(obj) {
    console.log(obj);
}

function sqlLog(rows) {
    console.log('Field count:', rows.fieldCount);
    console.log('Affected rows:', rows.affectedRows);
    console.log('Changed rows:', rows.changedRows);
    console.log('Insert ID:', rows.insertId);
    console.log('Server status:', rows.serverStatus);
    console.log('Warning count:', rows.warningCount);
    console.log('Message:', rows.message);
    console.log('Protocol 41:', rows.protocol41);
}

app.post('/login', upload.array(), function (req, res, next) {
    log(req);
    let received;
    log("Host: ", req.headers.host);
    if (!isEmptyObject(req.query)) {
        received = req.query;
        console.log("query..........");
    } else if (!isEmptyObject(req.body)) {
        received = req.body;
        console.log("body..........");
    }

    // if (received.loginB && received.username && received.password) {
    if (received.username && received.password) {
        console.log('Server request:');
        console.log(received);
        console.log(md5(received.password));
        console.log('Server response:');
        con.getConnection(function (err, conx) {
            if (err) {
                throw err;
                console.error(err.stack);
            }

            conx.query("SELECT * FROM users WHERE " +
                        "username='" + received.username + "'" +
                        " AND " +
                        "password='" + md5(received.password) + "'"
                        , function (err, rows) {
                if (err) {
                    throw err;
                    console.error(err.stack);
                }
                // if (rows.length => 1) {
                console.log('Results:', rows.length);
                if (rows.length > 0) {
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
                } else {

                }

            });
        });
        // res.json({success: true});
    } else {
        console.log("Required variables not met");
        console.log(req);
        res.json({success: false});
    }
});

/*
app.post('/api/users/signup', function (req, res) {
    con.getConnection(function (err, conx) {
        conx.query("SELECT * FROM users WHERE fname=2", function (err, rows) {
        // conx.query("INSERT INTO users (username) VALUES ('a')", function (err, rows) {
            conx.release();
            if (err) throw err;
            console.log(req.body.username);
            sqlLog(rows);
            console.log(JSON.stringify(rows));
            res.send(JSON.stringify(rows));
        });
    });
});
*/

app.get('/api/users', function (req, res) {
    /*
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    */
    con.getConnection(function (err, conx) {
        if (err) {
            throw err;
            console.error(err.stack);
        }
        conx.query("SELECT * FROM users", function (err, rows) {

            conx.release();
            if (err) {
                throw err;
                console.error(err.stack);
            }

            console.log('Results:', rows.length);
            // sqlLog(rows);
            log(req.headers.host);
            // log(req);

            console.log(JSON.stringify(rows));
            // console.log(res.json(rows));
            // res.send(JSON.stringify(rows));
            res.json(rows);
        });
    });
});

app.all('*', (req, res) => {
    res.send({ something: 'Hello my ' + req.method + ' friend' })
});

/*
app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})
*/
app.listen(port, () => console.log(`Listening on port ${port}`));
