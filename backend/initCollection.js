const mongoose = require("mongoose");
const Food = require("./models/Food");

const uri = "mongodb://gokulkannan7978_db_user:gokul_123@ac-wq9pxzc-shard-00-00.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-01.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-02.mwzr9vu.mongodb.net:27017/newproject_foodapp245?ssl=true&replicaSet=atlas-sjbzhi-shard-0&authSource=admin&appName=Cluster0";

const createCollection = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    // Insert a dummy item to force MongoDB to create the 'foods' collection
    await Food.create({
      name: "Dummy Item For Setup",
      price: 1,
      category: "Veg",
      image: "placeholder",
      description: "You can delete this later"
    });

    console.log("Successfully created the 'foods' collection!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createCollection();
