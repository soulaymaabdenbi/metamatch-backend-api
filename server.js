const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');


dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', authRoute);
app.use('/api/users', userRoute);

app.use('/test', (req, res) => {
    res.status(200).json({message: "Welcome to metamatch app"});

});
app.listen(process.env.PORT || 3000, () => console.log(`app listen on port ${process.env.PORT}!`));