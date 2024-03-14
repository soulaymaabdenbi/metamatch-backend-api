// Importez la fonction sendEmail depuis le fichier où elle est définie


const {sendEmail } = require('../Controllers/meetingController');

// Adresse e-mail de test
const testEmailAddress = 'nour.baatour123@gmail.com';

// Appel de la fonction sendEmail avec l'adresse e-mail de test
sendEmail(testEmailAddress, 'Test Subject', 'Test Body')
  .then(() => {
    console.log('E-mail envoyé avec succès à', testEmailAddress);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
  });
