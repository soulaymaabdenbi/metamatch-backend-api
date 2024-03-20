const User = require('../Models/user');
const Meeting = require('../Models/Meeting');
const nodemailer = require('nodemailer');


exports.getPhysiotherapists = async (req, res) => {
    try {
        const physiotherapists = await User.find({ userType: 'Physiotherapist' }, '_id email');
        res.status(200).json(physiotherapists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().populate('participants');
        res.status(200).json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};exports.scheduleMeeting = async (req, res) => {
    const { meetingName, meetingDate, selectedPhysiotherapist, description } = req.body;
    const playerId = '65f24462f3c7685ce4d91162'; 

    try {
        if (!meetingName || !meetingDate || !selectedPhysiotherapist) {
            return res.status(400).json({ message: 'Le nom, la date de la réunion ou le physiothérapeute sélectionné est manquant' });
        }

        if (new Date(meetingDate) < new Date()) {
            return res.status(400).json({ message: 'La date de la réunion doit être aujourd\'hui ou dans le futur' });
        }

      
        const meeting = new Meeting({ name: meetingName, date: meetingDate, participants: [playerId, selectedPhysiotherapist], description });
        await meeting.save();

        
        const player = await User.findById(playerId);
        const playerEmail = player.email;

        
        const physiotherapist = await User.findById(selectedPhysiotherapist);
        const physiotherapistEmail = physiotherapist.email;

        const confirmationLink = generateConfirmationLink(meeting._id);

        await sendEmail(physiotherapistEmail, 'Confirmation de réunion', `Cliquez sur ce lien pour confirmer la réunion : ${confirmationLink}`);

       
        const jitsiMeetLink = generateJitsiMeetLink(meeting.name, meeting.date);
        const emailSubject = 'Lien Jitsi Meet Pour La Réunion';
        const emailBody = `Bonjour, vous avez organisé une réunion.\n\nDate: ${meeting.date}\nLien: ${jitsiMeetLink}`;

        await Promise.all([
            sendEmail(playerEmail, emailSubject, emailBody),
            sendEmail(physiotherapistEmail, emailSubject, emailBody)
        ]);

        res.status(201).json(meeting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

  
async function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nour.baatour123@gmail.com', 
            pass: 'tczv wjla uxht bwxi' 
        }
    });

    const mailOptions = {
        from:'nour.baatour123@gmail.com', 
        to,
        subject,
        html: body
    };

    await transporter.sendMail(mailOptions);
}
function generateJitsiMeetLink(name, date) {
    const jitsiMeetDomain = 'meet.jit.si';


    if (!name || !date) {
        console.error('Le nom ou la date de la réunion est manquant.');
        return null;
    }

    const roomName = name.replace(/\s+/g, '-').toLowerCase();
    const formattedDate = date.toISOString();
    
    return `https://${jitsiMeetDomain}/${roomName}?date=${formattedDate}`;
}
exports.cancelMeeting = async function(req, res) {
    const { meetingId } = req.params;

    try {
       
        const meeting = await Meeting.findById(meetingId);
        
        
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }

      
        await Meeting.findByIdAndDelete(meetingId);

       
        const participants = await User.find({ _id: { $in: meeting.participants } });

        const emailSubject = 'Annulation de la réunion';
        const emailBody = `La réunion "${meeting.name}" prévue le ${meeting.date} a été annulée.`;

        const promises = participants.map(async participant => {
            await sendEmail(participant.email, emailSubject, emailBody);
        });

        await Promise.all(promises);

        res.status(200).json({ message: 'Réunion annulée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.updateMeeting = async (req, res) => {
    const { meetingId } = req.params;
    const { meetingName, meetingDate, selectedPhysiotherapist, description } = req.body;
  
    try {
    
      const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, {
        meetingName,
        meetingDate,
        selectedPhysiotherapist,
        description
      }, { new: true });
  
     
      const physiotherapist = await Physiotherapist.findById(selectedPhysiotherapist);
  
   
      if (physiotherapist) {
        const notificationData = {
          recipient: physiotherapist.email,
          subject: 'Modification de réunion',
          body: `La réunion "${meetingName}" a été modifiée pour le ${meetingDate}.`
        };
        NotificationService.sendNotification(notificationData);
      } else {
        console.warn(`Physiothérapeute avec l'ID ${selectedPhysiotherapist} non trouvé.`);
      }
  
  
      res.status(200).json(updatedMeeting);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réunion:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la réunion. Veuillez réessayer.' });
    }
  };
  function generateConfirmationLink(meetingId) {
   
    return `http://localhost:4000/api/confirmMeeting/${meetingId}`;
} 
exports.confirmMeeting = async (req, res) => {
    const { meetingId } = req.params;

    try {
      
        const meeting = await Meeting.findById(meetingId);
        
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }

        if (meeting.confirmed) {
            return res.status(400).json({ message: 'La réunion est déjà confirmée' });
        }

       
        meeting.confirmed = true;
        await meeting.save();

        res.status(200).json({ message: 'Réunion confirmée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


exports.getMeetingById = async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meeting = await Meeting.findById(meetingId);
        
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.sendEmail = sendEmail;
