var express = require('express');
var http = require("http");
const mongo = require('mongoose');
const multer = require('multer');
const config = require('./config/dbconnection');
const bodyParser = require('body-parser');
const injuryRouter = require('./routes/injurys.js'); 
const cors = require('cors');
const path = require("path");
const csvParser = require("csv-parser");
const { PythonShell } = require('python-shell');
const { scrapeBlessures } = require('./controllers/InjuryController.js');
const cron = require("node-cron");
const { spawn } = require('child_process');

var app = express();
app.use(cors());
mongo.connect(config.url , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log('CONNECTED TO DATABASE SUCCESSFULLY')).catch(err => console.error(err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.json());
app.use("/injury", injuryRouter);

cron.schedule("0 0 * * * ", async () => {
    try {
      await scrapeBlessures();
      console.log("Scraping triggered successfully");
    } catch (error) {
      console.error("Error occurred while triggering scraping:", error);
    }
});

app.post('/predict', (req, res) => {
    const data = req.body;
    const python = spawn('python', ['predict.py', data.position, data.team, data.nationality, data.age]);
    python.stdout.on('data', (data) => {
      res.send({ prediction: data.toString() });
    });
    python.on('error', (error) => {
        console.error(`Error occurred while executing Python script: ${error.message}`);
    });
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
server.setTimeout(500000); 
module.exports = app;
