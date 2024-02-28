const injury = require("../models/injury");

async function addInjury(req, res) {
  try {
    const u = await new injury(req.body).save().then((usr) => {
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

async function getAllInjury(req, res) {
  try {
    const data = await injury.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}

async function getInjurybyid(req, res) {
  try {
    const u = await injury.findById(req.params.id);
    res.status(200).json(u);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}

async function getInjurybyRecoveryStatus(req, res) {
  try {
    let recovery_status = req.params.recovery_status;
    const u = await injury.findOne({
      recovery_status: recovery_status,
    });
    res.status(200).json(u);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
}
async function updateInjury(req, res) {
	const {id} =req.params;
	const {player_id,date, type, description , recovery_status , duration}=req.body;
  try{
    const updateInjury= await injury.findByIdAndUpdate(
      id,
      {player_id,date, type, description , recovery_status , duration},
       { new: true }
  );
  if (!updateInjury){
    return res.status(404).json({error: "injury not found!"});
  }
  res.json(updateInjury);

  }
  catch(error){
    console.log("Error updating injury : "	, error);
    res.status(400).json({error: error.message});
  }
};


async function deleteInjury(req, res) {
  const { id } = req.params;
  try {
    const deletedInjury = await injury.findByIdAndDelete(id);
    if (!deletedInjury) {
      return res.status(404).json({ error: "injury not found" });
    }

    res.status(204).send("injury is  deleted !!!!!!!!");
  } catch (error) {
    console.log("Error deleting injury: ", error);
    res.status(500).json({ error: "could not delete injury" });
  }
}

module.exports = {
  addInjury,
  getAllInjury,
  getInjurybyid,
  getInjurybyRecoveryStatus,
  updateInjury,
  deleteInjury
  
};
