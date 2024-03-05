const Meeting = require('../Models/Meeting');
const User = require('../Models/User'); // Assurez-vous que le chemin est correct

exports.getPhysiotherapists = async (req, res) => {
    try {
        const physiotherapists = await User.find({ userType: 'Physiotherapist' }, 'username');
        res.status(200).json(physiotherapists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};exports.getMeetings = async (req, res) => {
    try {
        // Récupérer toutes les réunions avec les détails des participants
        const meetings = await Meeting.find().populate('participants');

        res.status(200).json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Logique de planification de la réunion
exports.scheduleMeeting = async (req, res) => {
    const { date, physiotherapistId, description } = req.body;
  
    // Assurez-vous que la propriété description est correctement définie dans le corps de la requête
   
    const playerId = '65e3d4cce63639c229b4fddf';
  
    try {
      // Vérifiez si la date est valide (ne doit pas être dans le passé)
      if (new Date(date) < new Date()) {
        return res.status(400).json({ message: 'Meeting date must be today or in the future' });
      }
  
      // Créez la réunion en utilisant le joueur et le physiothérapeute sélectionnés
      const meeting = new Meeting({ date, participants: [playerId, physiotherapistId], description });
      await meeting.save();
  
      res.status(201).json(meeting);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.cancelMeeting = async (req, res) => {
    const { meetingId } = req.params; // Récupérer l'identifiant de la réunion à annuler depuis les paramètres de la requête

    try {
        // Trouver la réunion dans la base de données
        const meeting = await Meeting.findById(meetingId);
        
        // Vérifier si la réunion existe
        if (!meeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }

        // Supprimer la réunion de la base de données
        await Meeting.findByIdAndDelete(meetingId);

        res.status(200).json({ message: 'Réunion annulée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
exports.updateMeeting = async (req, res) => {
    const { meetingId } = req.params; // Récupérer l'identifiant de la réunion à modifier depuis les paramètres de la requête
    const updateData = req.body; // Récupérer les données de mise à jour de la réunion depuis le corps de la requête

    try {
        // Vérifier si les données de mise à jour contiennent uniquement les champs autorisés
        const allowedFields = ['date', 'physiotherapistId']; // Liste des champs autorisés à mettre à jour
        const isValidOperation = Object.keys(updateData).every(field => allowedFields.includes(field));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Mise à jour invalide. Seuls les champs suivants peuvent être mis à jour : date, physiotherapistId' });
        }

        // Trouver la réunion dans la base de données et mettre à jour ses données
        const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, updateData, { new: true });

        // Vérifier si la réunion existe
        if (!updatedMeeting) {
            return res.status(404).json({ message: 'Réunion non trouvée' });
        }

        res.status(200).json({ message: 'Réunion mise à jour avec succès', meeting: updatedMeeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
