const { promises: fs } = require('fs');
const { join } = require('path');
const admin = require('firebase-admin');

// Define the path to the JSON file
const jsonFilePath = join(__dirname, 'config.json');

// Async function to read and initialize Firebase
async function initializeFirebase() {
  try {
    // Read the file
    const data = await fs.readFile(jsonFilePath, 'utf8');

    // Parse the JSON data
    const firebaseConfigJson = JSON.parse(data);
    // console.log('JSON data:', firebaseConfigJson);

    // Initialize Firebase admin with the config
    const firebaseConfig = {
      databaseURL: `https://${firebaseConfigJson.projectId}.firebaseio.com`,
      projectId: firebaseConfigJson.projectId
    };

    admin.initializeApp(firebaseConfig);

    return {
      db: admin.firestore(),
    };
  } catch (err) {
    console.error('Error reading or parsing the file:', err);
    throw err;
  }
}

const firebaseServicesPromise = initializeFirebase();

module.exports = { firebaseServicesPromise };
