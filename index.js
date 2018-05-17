const express = require('express');
const app = express();
const port = process.env.PORT || 1337;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ayyqr'
});

connection.connect();

function getUsers() {
    connection.query('SELECT username FROM users WHERE fname=123123', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].username);
    });
    return
}

connection.end();


// Main route sends our HTML file
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello from Express' }, end2);
});



// Begin listening
app.listen(port, () => console.log(`Listening on port ${port}`));
