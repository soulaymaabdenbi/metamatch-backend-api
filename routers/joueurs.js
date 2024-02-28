const express = require('express');
const router = express.Router();
const joueurController = require("../controller/JoueurController");


router.post('/addJoueur',joueurController.addJoueur);
router.get('/getAllJoueurs',joueurController.getJoueurs);
router.get('/getJoueurbyid/:id', joueurController.getByIdJoueur);
router.get('/getJoueurByName/:name',joueurController.getJoueurByName);


module.exports = router;