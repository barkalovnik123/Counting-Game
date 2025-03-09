const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');
/*
const {Pool} = require('pg');
const connectionString = `postgres://mywebappuser:user@localhost/mywebapp`;
const pool = new Pool({connectionString: connectionString});
*/

app.use(express.static(path.join(__dirname, '')));

router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', router);

let server = app.listen(80, function() {
	console.log("App Server via Express is running on port 3000");
	console.log("To end, press Ctrl + C");
});