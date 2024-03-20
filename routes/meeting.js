const express = require('express');
const router = express.Router();
const meetingController = require('../Controllers/meetingController');

//router.post('/scheduleMeeting', meetingController.scheduleMeeting);

//router.delete('/cancelMeeting/:meetingId', meetingController.cancelMeeting);

router.put('/updateMeeting/:meetingId', meetingController.updateMeeting);

//router.get('/physiotherapists', meetingController.getPhysiotherapists);

//router.get('/meetings', meetingController.getMeetings);

const { getPhysiotherapists, getMeetings, scheduleMeeting ,confirmMeeting} = require('../Controllers/meetingController');

router.get('/physiotherapists', getPhysiotherapists);
router.get('/meetings', getMeetings);
router.post('/schedule-meeting', scheduleMeeting);
router.delete('/cancel-meeting/:meetingId', meetingController.cancelMeeting);
router.put('/update-meeting/:meetingId', meetingController.cancelMeeting);
//router.get('/confirm-meeting/:meetingId', meetingController.confirmMeeting); 
router.post('/confirmMeeting/:meetingId', meetingController.confirmMeeting);
router.get('/meeting/:meetingId', meetingController.getMeetingById);
router.get('/confirmMeeting/:meetingId', meetingController.confirmMeeting); 
module.exports = router;
