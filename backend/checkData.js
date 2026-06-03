const mongoose = require("mongoose");

const checkData = async () => {
  try {
    // Check the 'test' database (where old data was saved)
    const oldUri = "mongodb://gokulkannan7978_db_user:gokul_123@ac-wq9pxzc-shard-00-00.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-01.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-02.mwzr9vu.mongodb.net:27017/?ssl=true&replicaSet=atlas-sjbzhi-shard-0&authSource=admin";
    
    console.log("Connecting to the default 'test' database...");
    const conn1 = await mongoose.createConnection(oldUri).asPromise();
    const oldUsers = await conn1.collection("users").find({}).toArray();
    console.log("\n--- Users found in the 'test' database ---");
    console.log(oldUsers.length > 0 ? oldUsers : "No users found.");
    await conn1.close();

    // Check the new database
    const newUri = "mongodb://gokulkannan7978_db_user:gokul_123@ac-wq9pxzc-shard-00-00.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-01.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-02.mwzr9vu.mongodb.net:27017/newproject_foodapp245?ssl=true&replicaSet=atlas-sjbzhi-shard-0&authSource=admin";
    
    console.log("\nConnecting to the 'newproject_foodapp245' database...");
    const conn2 = await mongoose.createConnection(newUri).asPromise();
    const newUsers = await conn2.collection("users").find({}).toArray();
    console.log("\n--- Users found in the 'newproject_foodapp245' database ---");
    console.log(newUsers.length > 0 ? newUsers : "No users found.");
    await conn2.close();
    
    process.exit(0);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

checkData();
