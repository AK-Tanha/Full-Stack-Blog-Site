const mongoose = require('mongoose');
require('dotenv').config();

async function inspectDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URL:", process.env.MONGODB_URL.replace(/:([^@]+)@/, ':****@')); // Log masked URL
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected successfully to:", mongoose.connection.name);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\nCollections:");
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(` - ${col.name} (${count} documents)`);
      
      if (count > 0) {
        const sample = await mongoose.connection.db.collection(col.name).findOne();
        console.log(`   Sample _id: ${sample._id}`);
        if (sample.title) console.log(`   Sample Title: ${sample.title}`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

inspectDatabase();
