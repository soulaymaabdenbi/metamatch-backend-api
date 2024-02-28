const joueur = require("../models/joueur");

async function addJoueur(req, res) {
  try {
    const u = await new joueur(req.body).save().then((usr) => {
      console.log(req.body);
      res.status(200).json(usr);
    }).catch((err) => {
      console.error(err);
      res.status(400).json({
        error: err.message,
      });
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}

async function getJoueurs(req, res) {
  try {
    const data = await joueur.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}

async function getByIdJoueur(req, res) {
  try {
    const u = await joueur.findById(req.params.id);
    res.status(200).json(u);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}

async function getJoueurByName(req, res) {
  try {
    let name = req.params.name;
    const u = await joueur.findOne({
      name: name,
    });
    res.status(200).json(u);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}

module.exports = {
    addJoueur,
  getJoueurs,
  getByIdJoueur,
  getJoueurByName
};
