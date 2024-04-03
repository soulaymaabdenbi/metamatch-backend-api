const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-global');
const Injury = require('../models/injury');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Injury Model Tests', () => {
  it('Should create a new injury', async () => {
    console.log('Testing creation of a new injury...');
    const injuryData = {
      player_id: new mongoose.Types.ObjectId(),
      date: new Date(),
      type: 'Fracture',
      description: 'Fracture de la jambe droite',
      recovery_status: 'In Progress',
      duration: new Date(),
    };

    const newInjury = new Injury(injuryData);
    const savedInjury = await newInjury.save();

    expect(savedInjury).toMatchObject(injuryData);
    expect(savedInjury._id).toBeDefined();
    console.log('New injury created successfully.');
  });

  it('Should update an existing injury', async () => {
    console.log('Testing update of an existing injury...');
    const injuryToUpdate = await Injury.findOne({ type: 'Fracture' });
    const newType = 'Entorse';

    injuryToUpdate.type = newType;
    const updatedInjury = await injuryToUpdate.save();

    expect(updatedInjury.type).toEqual(newType);
    console.log('Existing injury updated successfully.');
  });

  it('Should delete an existing injury', async () => {
    console.log('Testing deletion of an existing injury...');
    const injuryToDelete = new Injury({
      player_id: new mongoose.Types.ObjectId(),
      date: new Date(),
      type: 'Entorse',
      description: 'Entorse de la cheville',
      recovery_status: 'In Progress',
      duration: new Date(),
    });

    await injuryToDelete.save();

    const deletedInjury = await Injury.findByIdAndDelete(injuryToDelete._id);

    const deletedInjuryCheck = await Injury.findById(injuryToDelete._id);
    expect(deletedInjuryCheck).toBeNull();
    console.log('Existing injury deleted successfully.');
  });
});
