const mongoose = require('mongoose');
require('dotenv').config();

async function listDatabases() {
  try {
    console.log("Connecting to MongoDB...");
    // Connect to the cluster (without specifying a db in the path if possible, or just use the string)
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected successfully.");

    // Use the native driver to list databases
    const admin = mongoose.connection.db.admin();
    const result = await admin.listDatabases();

    console.log("\nAvailable Databases:");
    result.databases.forEach(db => {
      console.log(` - ${db.name} \t(Size: ${db.sizeOnDisk} bytes)`);
    });

    console.log("\nCurrent Database in Connection String:");
    // Parse the DB name from the connection string or connection object
    console.log(` - ${mongoose.connection.name}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

listDatabases();
