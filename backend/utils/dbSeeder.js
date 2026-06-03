const mongoose = require("mongoose");
const Food = require("../models/Food");
const User = require("../models/User");
const Category = require("../models/Category");

const categories = [
  { name: "Veg",      description: "Pure vegetarian dishes",        emoji: "🥗" },
  { name: "Non-Veg",  description: "Chicken, mutton, seafood",      emoji: "🍗" },
  { name: "Desserts", description: "Sweet treats and desserts",     emoji: "🍰" },
  { name: "Drinks",   description: "Beverages and refreshments",    emoji: "🥤" },
  { name: "Starters", description: "Starters and appetizers",       emoji: "🍢" },
  { name: "Breads",   description: "Naan, roti, paratha",           emoji: "🫓" },
];

const foods = [
  // Veg
  { name: "Paneer Butter Masala",   price: 280, category: "Veg",      rating: 4.5, time: "25 min", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop", description: "Rich and creamy paneer curry with aromatic butter sauce" },
  { name: "Dal Makhani",            price: 249, category: "Veg",      rating: 4.4, time: "30 min", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", description: "Slow-cooked black lentils with butter and cream" },
  { name: "Palak Paneer",           price: 260, category: "Veg",      rating: 4.4, time: "25 min", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", description: "Cottage cheese cubes in smooth, spiced spinach gravy" },
  { name: "Chole Bhature",          price: 179, category: "Veg",      rating: 4.6, time: "20 min", image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop", description: "Spiced chickpea curry served with deep-fried fluffy bread" },
  { name: "Veg Burger",             price: 179, category: "Veg",      rating: 4.2, time: "15 min", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop", description: "Crispy veggie patty with fresh lettuce and special sauce" },
  { name: "Mushroom Risotto",       price: 299, category: "Veg",      rating: 4.5, time: "35 min", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop", description: "Creamy Italian rice cooked with wild mushrooms and parmesan" },
  { name: "Pav Bhaji",              price: 159, category: "Veg",      rating: 4.5, time: "20 min", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop", description: "Spicy mashed vegetable curry served with buttered pav buns" },
  { name: "Veg Biryani",            price: 249, category: "Veg",      rating: 4.3, time: "35 min", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop", description: "Fragrant basmati rice layered with spiced vegetables and saffron" },
  
  // Non-Veg
  { name: "Chicken Biryani",        price: 349, category: "Non-Veg",  rating: 4.7, time: "35 min", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", description: "Aromatic basmati rice cooked with tender chicken pieces" },
  { name: "Butter Chicken",         price: 320, category: "Non-Veg",  rating: 4.6, time: "30 min", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop", description: "Tender chicken in a rich, creamy tomato-based curry" },
  { name: "Chicken Tikka",          price: 329, category: "Non-Veg",  rating: 4.7, time: "30 min", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", description: "Marinated chicken chunks grilled to smoky perfection" },
  { name: "Mutton Rogan Josh",      price: 399, category: "Non-Veg",  rating: 4.8, time: "45 min", image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop", description: "Tender mutton slow-cooked in Kashmiri aromatic spices" },
  { name: "Prawn Masala",           price: 379, category: "Non-Veg",  rating: 4.6, time: "30 min", image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop", description: "Juicy prawns cooked in a tangy coastal spice masala" },
  { name: "Grilled Fish Tacos",     price: 299, category: "Non-Veg",  rating: 4.3, time: "25 min", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", description: "Soft tacos filled with grilled fish, slaw and chipotle mayo" },
  
  // Starters
  { name: "Veg Spring Rolls",       price: 149, category: "Starters", rating: 4.3, time: "15 min", image: "https://images.unsplash.com/photo-1548611635-29bafca01e01?w=400&h=300&fit=crop", description: "Crispy rolls filled with seasoned vegetables and glass noodles" },
  { name: "Samosa (2 pcs)",         price: 79,  category: "Starters", rating: 4.5, time: "10 min", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", description: "Golden fried pastry filled with spiced potatoes and peas" },
  { name: "French Fries",           price: 99,  category: "Starters", rating: 4.2, time: "10 min", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop", description: "Crispy golden fries seasoned with sea salt and herbs" },
  
  // Breads
  { name: "Butter Naan",            price: 49,  category: "Breads",   rating: 4.5, time: "10 min", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop", description: "Soft leavened bread baked in tandoor and brushed with butter" },
  { name: "Garlic Naan",            price: 59,  category: "Breads",   rating: 4.6, time: "10 min", image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop", description: "Tandoor-baked naan topped with minced garlic and coriander" },
  
  // Desserts
  { name: "Chocolate Lava Cake",    price: 199, category: "Desserts", rating: 4.8, time: "20 min", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop", description: "Warm chocolate cake with a molten gooey center" },
  { name: "Gulab Jamun",            price: 99,  category: "Desserts", rating: 4.5, time: "15 min", image: "https://images.unsplash.com/photo-1666277011989-2f84e9f93498?w=400&h=300&fit=crop", description: "Soft milk-solid balls soaked in rose-flavored sugar syrup" },
  { name: "Cheesecake Slice",       price: 219, category: "Desserts", rating: 4.7, time: "10 min", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop", description: "Classic New York style cheesecake with berry compote" },
  { name: "Brownie Sundae",         price: 249, category: "Desserts", rating: 4.9, time: "15 min", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop", description: "Warm fudge brownie topped with vanilla ice cream and chocolate sauce" },
  
  // Drinks
  { name: "Mango Lassi",            price: 129, category: "Drinks",   rating: 4.6, time: "10 min", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop", description: "Refreshing yogurt-based drink blended with fresh mango pulp" },
  { name: "Cold Coffee",            price: 149, category: "Drinks",   rating: 4.4, time: "10 min", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop", description: "Chilled coffee blended with milk and sugar" },
  { name: "Fresh Lime Soda",        price: 89,  category: "Drinks",   rating: 4.3, time: "5 min",  image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop", description: "Fizzy and refreshing lime soda with a hint of mint" },
];

const adminUser = {
  name: "SwiftBite Admin",
  email: "admin@swiftbite.com",
  password: "admin123",
  role: "admin",
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Food.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑  Cleared existing database collections.");

    // Seed categories
    await Category.insertMany(categories);
    console.log(`🏷  Seeded ${categories.length} categories.`);

    // Seed foods
    await Food.insertMany(foods);
    console.log(`🍽  Seeded ${foods.length} food items.`);

    // Create admin user if not exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log("👤  Admin user created → email: admin@swiftbite.com | password: admin123");
    } else {
      console.log("👤  Admin user already exists.");
    }
    console.log("🌱  Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  }
};

module.exports = { seedDatabase };
