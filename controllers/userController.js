const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

module.exports = {
    getUser: async (req, res) => {
        const userId = req.user.id;

        try {
            const user = await User.findById({_id: userId}, {__v: 0, updatedAt: 0, createdAt: 0, password: 0});
            res.status(200).json({status: true, user});
        } catch (e) {
            req.status(500).json({status: false, message: 'error getting user', error: e.message});
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.user.id;

        try {
            await User.findByIdAndDelete({_id: userId});
            res.status(200).json({status: true, message: 'user deleted successfully'});
        } catch (e) {
            req.status(500).json({status: false, message: 'error deleting user', error: e.message});
        }
    },

    updateUser: async (req, res) => {
        const userId = req.user.id;
        try {
            await User.findByIdAndUpdate({_id: userId}, {$set: req.body}, {new: true});
            res.status(200).json({status: true, message: 'user updated successfully'});
        } catch (e) {
            res.status(500).json({status: false, message: 'error updating user', error: e.message});
        }
    },

    verifyAccount: async (req, res) => {
        const otp = req.params.otp;
        const userId = req.user.id;

        try {
            const user = await User.findById({_id: userId});

            if (user.otp === otp) {
                user.emailVerified = true;
                await user.save();
                res.status(200).json({status: true, message: 'account verified successfully'});
            }
            res.status(400).json({status: false, message: 'invalid otp'});
        } catch (e) {
            res.status(500).json({status: false, message: 'error verifying account', error: e.message});
        }

    }
}