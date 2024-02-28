const express = require('express');
const injury = require('../models/injury');
const router = express.Router();
const injuryControllerr=require("../controller/InjuryController");




router.post('/addInjury',injuryControllerr.addInjury);
router.get('/getAllInjury',injuryControllerr.getAllInjury);
router.get('/getInjurybyid/:id', injuryControllerr.getInjurybyid);
router.get('/getInjurybyStatus/:recovery_status',injuryControllerr.getInjurybyRecoveryStatus);
router.put('/updateInjury/:id', injuryControllerr.updateInjury);
router.delete('/deleteInjury/:id', injuryControllerr.deleteInjury);



module.exports = router;