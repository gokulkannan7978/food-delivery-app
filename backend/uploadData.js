const mongoose = require("mongoose");
const Food = require("./models/Food");

const uri = "mongodb://gokulkannan7978_db_user:gokul_123@ac-wq9pxzc-shard-00-00.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-01.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-02.mwzr9vu.mongodb.net:27017/newproject_foodapp245?ssl=true&replicaSet=atlas-sjbzhi-shard-0&authSource=admin&appName=Cluster0";

const categories = [
  "Pizza", "Burger", "Biryani", "Pasta", "Dessert", 
  "Drinks", "South Indian", "North Indian", "Chinese", "Snacks"
];

const foodNames = {
  Pizza: ["Margherita", "Farmhouse", "Veg Supreme", "Cheese Burst"],
  Burger: ["Veg Burger", "Chicken Burger", "Paneer Burger", "Zinger Burger"],
  Biryani: ["Chicken Biryani", "Mutton Biryani", "Veg Biryani", "Egg Biryani"],
  Pasta: ["White Sauce Pasta", "Red Sauce Pasta", "Cheese Pasta", "Veg Pasta"],
  Dessert: ["Ice Cream", "Brownie", "Cake", "Donut"],
  Drinks: ["Mango Juice", "Lemon Juice", "Milkshake", "Cold Coffee", "Tea", "Coffee"],
  "South Indian": ["Dosa", "Idli", "Poori", "Pongal", "Chicken Rice", "White Rice Meal"],
  "North Indian": ["Butter Naan", "Paneer Butter Masala", "Chole Bhature", "Dal Makhani"],
  Chinese: ["Noodles", "Fried Rice", "Manchurian", "Spring Roll"],
  Snacks: ["French Fries", "Samosa", "Sandwich", "Puffs"]
};

// Hand-picked beautiful food images for each category
const categoryImages = {
  Pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop"
  ],
  Burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop"
  ],
  Biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop"
  ],
  Pasta: [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop"
  ],
  Dessert: [
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop"
  ],
  Drinks: [
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop"
  ],
  "South Indian": [
    "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1630409351241-19e48753232c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop"
  ],
  "North Indian": [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"
  ],
  Chinese: [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"
  ],
  Snacks: [
    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1548611635-29bafca01e01?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1623653387945-2fd256d4f214?w=400&h=300&fit=crop"
  ]
};

const uploadData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    const foods = [];
    for (let i = 1; i <= 450; i++) {
      let category = categories[Math.floor(Math.random() * categories.length)];
      let name = foodNames[category][Math.floor(Math.random() * foodNames[category].length)];
      
      // Select a random image specific to this category
      let imageArray = categoryImages[category];
      let imageUrl = imageArray[Math.floor(Math.random() * imageArray.length)];

      foods.push({
        name: `${name} ${i}`,
        category: category,
        price: Math.floor(Math.random() * 400) + 50,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        image: imageUrl,
        description: `Delicious ${name} for food lovers`,
        isAvailable: true
      });
    }

    console.log("Generated 450 food items with REAL food images. Updating database...");
    
    // Clear old foods just in case, then insert new ones
    await Food.deleteMany({});
    await Food.insertMany(foods);

    console.log("✅ Successfully uploaded all 450 food items to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading data:", error);
    process.exit(1);
  }
};

uploadData();
