const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
     "mongodb://gokulkannan7978_db_user:gokul_123@ac-wq9pxzc-shard-00-00.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-01.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-02.mwzr9vu.mongodb.net:27017/newproject_foodapp245?ssl=true&replicaSet=atlas-sjbzhi-shard-0&authSource=admin&appName=Cluster0";

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};

module.exports = connectDB;

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     let mongoUri = process.env.MONGO_URI;

//     // Check if Mongo URI is a placeholder, empty, or missing
//     const isPlaceholder = !mongoUri || 
//       mongoUri.includes("<username>") || 
//       mongoUri.includes("xxxxx") ||
//       mongoUri.trim() === "";

//     if (isPlaceholder) {
//       console.log("ℹ️ MONGO_URI is missing or a placeholder.");
//       console.log("🚀 Launching in zero-download virtual JavaScript database engine mode!");
//       process.env.MOCK_DATABASE = "true";
//       return;
//     }

//     const conn = await mongoose.connect(mongoUri);
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.warn(`⚠️ MongoDB Connection failed: ${error.message}`);
//     console.log("🚀 Falling back to zero-download virtual JavaScript database engine mode!");
//     process.env.MOCK_DATABASE = "true";
//   }
// };

// module.exports = connectDB;
