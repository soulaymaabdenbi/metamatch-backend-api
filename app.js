var express = require('express');
var http = require("http");
const mongo = require('mongoose');
const config = require('./config/dbconnection');
const bodyParser = require('body-parser');
const injuryRouter = require('./routers/injurys.js'); 
const joueurRouter = require('./routers/joueurs.js'); 
const cors = require('cors');
const path=require("path");
var app = express();
app.use(cors());
mongo.connect(config.url , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log('CONNECTED TO DATABASEE SUCCESSFULLY')).catch(err => console.error(err));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","twig");
app.use(bodyParser.json());
app.use("/injury",injuryRouter);
app.use("/joueur",joueurRouter);

const server = http.createServer(app);


server.listen(3000,console.log("SERVER IS RUNNING ON PORT 3000"));

module.exports = app;


