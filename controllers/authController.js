const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {validateEmail, validatePassword, encryptPassword, generateRandomPassword} = require('../utils/helper');
const {sendAccountCredentials} = require("../utils/smtp_function");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


module.exports = {

    createUser: async (req, res) => {
        let {
            fullname, username, email, address, phone, role, profile, height,      // New field
            weight,      // New field
            age,         // New field
            nationality  // New field
        } = req.body;


        try {
            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                return res.status(400).json({status: false, message: "User already exists"});
            }
            password = generateRandomPassword();
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
                height,
                weight,
                age,
                nationality
            });

            const savedUser = await newUser.save();
            await sendAccountCredentials(email, username, password); // Make sure this function exists and is imported
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
    },

    googleSignIn: async (req, res) => {
        const { token } = req.body;
        try {
            // Verify the Google token
            const ticket = await client.verifyIdToken({
                idToken: token,
                requiredAudience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            console.log('Google Payload:', payload.email);
            // Check if the user already exists in the database
            const user = await User.findOne({ email: payload.email }).select('-__v -updatedAt -createdAt');
            console.log('User:', user);
            if (user) {
                // If the user exists, generate a token for the user
                const userToken = jwt.sign({
                    id: user._id,
                    role: user.role,
                    email: user.email
                }, process.env.JWT_SECRET, { expiresIn: '21d' });

                // Prepare user details excluding sensitive information
                const { password, ...userDetails } = user._doc;

                res.status(200).json({
                    ...userDetails,
                    token: userToken,
                });
            } else {
                // If user doesn't exist, return an error
                res.status(404).json({ status: false, message: "No account found with this email address." });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: "Error signing in with Google", error: error.message });
        }
    },

}
