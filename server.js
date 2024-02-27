const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const { generateRandomPassword, validatePassword } = require('./utils/helper');


dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', authRoute);
app.use('/api/users', userRoute);

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
app.listen(process.env.PORT || 3000, () => console.log(`app listen on port ${process.env.PORT}!`));