const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http'); // Import du module http


const cors = require('cors');
app.use(cors());


const meetingRoutes = require('./routes/meeting');


const mongo = require('mongoose');
const config = require('./Config/dbConnection');

mongo.connect(config.url , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('CONNECTED TO DATABASE SUCCESSFULLY');
}).catch(err => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', meetingRoutes);

app.use('/test', (req, res) => {
    let password = generateRandomPassword();

    if (!validatePassword(password)) {
        return res.status(400).json({
            status: false,
            message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
        });
    }
    return res.status(200).json({status: true, password});
});


const server = http.createServer(app);
server.listen(4000, () => {
  console.log("SERVER IS RUNNING ON PORT 3000");
});



// Utilisation de la fonction pour générer un jeton JWT de test

module.exports = app;
