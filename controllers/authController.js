const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {validateEmail, validatePassword, encryptPassword, generateRandomPassword} = require('../utils/helper');
const { sendAccountCredentials } = require("../utils/smtp_function");

module.exports = {
    createUser: async (req, res) => {
        let {fullname, username, email, password, address, phone, role, profile} = req.body;
        console.log("before generate password : " + password)

        if (!password) {
            password = generateRandomPassword();
            console.log("after generate password : " + password)
        }

        if (!validateEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid email address"});
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }

        try {
            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                return res.status(400).json({status: false, message: "User already exists"});
            }
            const encryptedPassword = encryptPassword(password);

            const newUser = new User({
                fullname,
                username,
                email,
                password: encryptedPassword,
                address,
                phone,
                role,
                profile: profile || "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                verification: false,
            });

            const savedUser = await newUser.save();
            await sendAccountCredentials(email, username, password);
            res.status(201).json({status: true, message: "User created successfully", user: savedUser});
        } catch (error) {
            res.status(500).json({status: false, message: "Error creating user", error: error.message});
        }
    }, loginUser: async (req, res) => {
        const {email, password} = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({status: false, message: "Invalid email address"});
        }

        try {
            const user = await User.findOne({email: email}).select('-__v -updatedAt -createdAt');
            if (!user) {
                return res.status(401).json({status: false, message: "Wrong email or password"}); // Use a generic message for security
            }

            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (decryptedPassword !== password) {
                return res.status(401).json({status: false, message: "Wrong email or password"}); // Use a generic message for security
            }

            const token = jwt.sign({
                id: user._id, role: user.role, email: user.email
            }, process.env.JWT_SECRET, {expiresIn: "21d"});

            const {password: userPassword, ...userDetails} = user._doc;

            res.status(200).json({...userDetails, token});
        } catch (error) {
            res.status(500).json({status: false, message: error.message});
        }
    }
}
