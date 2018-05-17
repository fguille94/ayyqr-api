const express = require('express');
const app = express();
const port = process.env.PORT || 1337;
const mysql = require('mysql');

let con = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'ayyqr'
});

app.post('/api/users/signup', function (req, res) {
    con.getConnection(function (err, conx) {
        conx.query("INSERT INTO users (username) VALUES ('a')", function (err, rows) {
            conx.release();
            if (err) throw err;
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

app.get('/api/users', function (req, res) {
    con.getConnection(function (err, conx) {
        conx.query("SELECT * FROM users", function (err, rows) {
            conx.release();
            if (err) throw err;
            console.log('Results:', rows.length);
            console.log(JSON.stringify(rows));
            res.send(JSON.stringify(rows));
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
