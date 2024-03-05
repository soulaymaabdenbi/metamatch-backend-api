const express = require('express');
const router = express.Router();
const meetingController = require('../Controllers/meetingController');


router.post('/scheduleMeeting', meetingController.scheduleMeeting);

router.delete('/cancelMeeting/:meetingId', meetingController.cancelMeeting);

router.put('/updateMeeting/:meetingId', meetingController.updateMeeting);

router.get('/physiotherapists', meetingController.getPhysiotherapists);

router.get('/meetings', meetingController.getMeetings);



module.exports = router;
