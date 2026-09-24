const mongoose = require('mongoose');

const uri = "mongodb://barsham734_db_user:Barsha2003@ac-ms0fzio-shard-00-00.bxgkrjo.mongodb.net:27017,ac-ms0fzio-shard-00-01.bxgkrjo.mongodb.net:27017,ac-ms0fzio-shard-00-02.bxgkrjo.mongodb.net:27017/nestmate?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB.");
    const db = mongoose.connection.db;
    try {
      await db.collection('profiles').dropIndex('userId_1');
      console.log("Successfully dropped userId_1 index");
    } catch (err) {
      console.log("Error dropping index:", err.message);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
