const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4 // Force IPv4 to prevent IPv6 DNS routing issues (ECONNREFUSED)
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically drop stale 'userId_1' index from profiles collection to fix duplicate key error
    try {
      await conn.connection.db.collection('profiles').dropIndex('userId_1');
      console.log('Stale userId_1 index dropped successfully from profiles collection.');
    } catch (e) {
      if (e.codeName !== 'IndexNotFound') {
        console.log('Note: could not drop userId_1 index (might not exist):', e.message);
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
