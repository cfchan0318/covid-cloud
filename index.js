const express = require('express');
const path = require('path');
const app = express();

var mysql = require('mysql');

// create a connection variable with the required details
var con = mysql.createConnection({
    host: "covid-cloud.cxeus2cm8csz.us-east-2.rds.amazonaws.com", // ip address of server running mysql
    user: "admin", // user name to your mysql database
    password: "34217787", // corresponding password
    database: "covid_cloud_record" // use the specified database
});

// make to connection to the database.
con.connect(function (err) {
    if (err) throw err;
    // if connection is successful
    console.log('connection successful');
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//get students health record
app.get('/api/getStudents', (req, res) => {
    con.query("SELECT * FROM student_health", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/api/addRecord',(req,res)=>{
    var { studentId, name, temperature,location,healthStatus } = req.body;
    var records = [[req.body.studentId, req.body.name, req.body.temperature,req.body.location,req.body.healthStatus]];
    if (records[0][0] != null) {
        con.query("INSERT into student_health (PK_studentId,name,temperature,location,healthStatus) VALUES ?", [records], function (err, res, fields) { if (err) throw err; });
    }
    res.send("Student's Health Record added successfully.");
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);