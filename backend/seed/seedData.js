const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../models/Food");
const User = require("../models/User");
const Category = require("../models/Category");

dotenv.config();

const UNSPLASH_KEY = "5yF0Qzq5A5oT6wp64MVOK-Af-qhM7F0iyJbxvbGdPtM";

// ─── Categories ──────────────────────────────────────────────────────────────
const categoryList = [
  { name: "Biryani",      description: "Authentic TN Biryani",    emoji: "🍛" },
  { name: "South Indian", description: "Dosa, Idli, Parotta",     emoji: "🥘" },
  { name: "Non-Veg",      description: "Chicken, Mutton, Fish",   emoji: "🍗" },
  { name: "Starters",     description: "Crispy fries and roasts", emoji: "🍢" },
  { name: "Desserts",     description: "Halwa, Jigarthanda",      emoji: "🍧" },
  { name: "Drinks",       description: "Beverages and Shakes",    emoji: "🥤" },
  { name: "Pizza",        description: "Cheesy wood-fired pizzas", emoji: "🍕" },
  { name: "Burger",       description: "Juicy premium burgers",   emoji: "🍔" },
  { name: "Chinese",      description: "Noodles, Fried Rice",     emoji: "🥡" },
  { name: "North Indian", description: "Rich creamy curries",     emoji: "🍲" },
];

// ─── Each food sub-type with its own Unsplash search query ─────────────────
// Format: { name, category, searchQuery, variants (adjective prefixes) }
const foodSubTypes = [
  // Biryani (6 sub-types × ~7 variants each = 42)
  { name: "Chicken Biryani",      category: "Biryani", q: "chicken biryani" },
  { name: "Mutton Biryani",       category: "Biryani", q: "mutton biryani" },
  { name: "Egg Biryani",          category: "Biryani", q: "egg biryani rice" },
  { name: "Prawn Biryani",        category: "Biryani", q: "prawn biryani seafood" },
  { name: "Veg Biryani",          category: "Biryani", q: "vegetable biryani" },
  { name: "Seeraga Samba Biryani",category: "Biryani", q: "seeraga samba biryani" },

  // South Indian (8 sub-types)
  { name: "Ghee Roast Dosa",  category: "South Indian", q: "dosa indian" },
  { name: "Masala Dosa",      category: "South Indian", q: "masala dosa" },
  { name: "Onion Rava Dosa",  category: "South Indian", q: "rava dosa" },
  { name: "Kothu Parotta",    category: "South Indian", q: "parotta indian" },
  { name: "Egg Parotta",      category: "South Indian", q: "egg parotta" },
  { name: "Idiyappam",        category: "South Indian", q: "idiyappam string hoppers" },
  { name: "Pongal",           category: "South Indian", q: "pongal indian food" },
  { name: "Medu Vada",        category: "South Indian", q: "medu vada" },

  // Non-Veg (6 sub-types)
  { name: "Chettinad Chicken Curry", category: "Non-Veg", q: "chicken curry indian" },
  { name: "Mutton Chukka",          category: "Non-Veg", q: "mutton dry roast" },
  { name: "Fish Kuzhambu",          category: "Non-Veg", q: "fish curry indian" },
  { name: "Prawn Masala",           category: "Non-Veg", q: "prawn masala" },
  { name: "Chicken Varuval",        category: "Non-Veg", q: "spicy chicken fry" },
  { name: "Pepper Chicken",         category: "Non-Veg", q: "pepper chicken" },

  // Starters (7 sub-types)
  { name: "Chicken 65",         category: "Starters", q: "chicken 65 indian" },
  { name: "Paneer 65",          category: "Starters", q: "paneer fried appetizer" },
  { name: "Gobi 65",            category: "Starters", q: "cauliflower fry" },
  { name: "Fish Fry",           category: "Starters", q: "fish fry crispy" },
  { name: "Mutton Pepper Roast",category: "Starters", q: "mutton roast" },
  { name: "Prawn Fry",          category: "Starters", q: "prawn fry crispy" },
  { name: "Chicken Lollipop",   category: "Starters", q: "chicken lollipop" },

  // Desserts (6 sub-types)
  { name: "Jigarthanda",      category: "Desserts", q: "milkshake dessert drink" },
  { name: "Tirunelveli Halwa", category: "Desserts", q: "halwa indian sweet" },
  { name: "Mysurpa",           category: "Desserts", q: "mysore pak sweet" },
  { name: "Gulab Jamun",       category: "Desserts", q: "gulab jamun" },
  { name: "Rasmalai",          category: "Desserts", q: "rasmalai indian dessert" },
  { name: "Brownie Sundae",    category: "Desserts", q: "brownie sundae chocolate" },

  // Drinks (7 sub-types) — EACH gets unique search!
  { name: "Filter Coffee",     category: "Drinks", q: "south indian filter coffee" },
  { name: "Paneer Soda",       category: "Drinks", q: "rose soda pink drink" },
  { name: "Nannari Sarbath",   category: "Drinks", q: "herbal green drink" },
  { name: "Rose Milk",         category: "Drinks", q: "rose milk pink milkshake" },
  { name: "Mango Lassi",       category: "Drinks", q: "mango lassi yogurt" },
  { name: "Cold Coffee",       category: "Drinks", q: "iced coffee cold brew" },
  { name: "Watermelon Juice",  category: "Drinks", q: "watermelon juice fresh" },

  // Pizza (5 sub-types)
  { name: "Margherita Pizza",     category: "Pizza", q: "margherita pizza" },
  { name: "Pepperoni Pizza",      category: "Pizza", q: "pepperoni pizza" },
  { name: "BBQ Chicken Pizza",    category: "Pizza", q: "bbq chicken pizza" },
  { name: "Veggie Supreme Pizza", category: "Pizza", q: "vegetable pizza" },
  { name: "Cheese Burst Pizza",   category: "Pizza", q: "cheese pizza melting" },

  // Burger (5 sub-types)
  { name: "Chicken Zinger Burger", category: "Burger", q: "crispy chicken burger" },
  { name: "Classic Veg Burger",    category: "Burger", q: "veggie burger" },
  { name: "Double Cheese Burger",  category: "Burger", q: "double cheeseburger" },
  { name: "Spicy Paneer Burger",   category: "Burger", q: "paneer burger indian" },
  { name: "Mutton Patty Burger",   category: "Burger", q: "lamb burger patty" },

  // Chinese (6 sub-types)
  { name: "Chicken Fried Rice", category: "Chinese", q: "chicken fried rice" },
  { name: "Egg Noodles",        category: "Chinese", q: "egg noodles chinese" },
  { name: "Gobi Manchurian",    category: "Chinese", q: "gobi manchurian" },
  { name: "Chilli Chicken",     category: "Chinese", q: "chilli chicken chinese" },
  { name: "Hakka Noodles",      category: "Chinese", q: "hakka noodles" },
  { name: "Spring Roll",        category: "Chinese", q: "spring rolls crispy" },

  // North Indian (6 sub-types)
  { name: "Butter Naan",          category: "North Indian", q: "butter naan bread" },
  { name: "Garlic Naan",          category: "North Indian", q: "garlic naan" },
  { name: "Paneer Butter Masala", category: "North Indian", q: "paneer butter masala" },
  { name: "Dal Makhani",          category: "North Indian", q: "dal makhani lentil" },
  { name: "Tandoori Chicken",     category: "North Indian", q: "tandoori chicken" },
  { name: "Malai Kofta",          category: "North Indian", q: "malai kofta indian" },
];

const adjectives = ["Spicy", "Classic", "Premium", "Chef's Special", "Authentic", "Homestyle", "Special", "Extra Spicy", "Royal", "Signature"];

const adminUser = {
  name: "SwiftBite Admin",
  email: "admin@swiftbite.com",
  password: "admin123",
  role: "admin",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Curated fallback images per sub-type (for when API rate-limits us) ────
const fallbackImages = {
  // South Indian items that failed
  "Kothu Parotta":    ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1610192773928-7692552431fa?w=400&h=300&fit=crop"],
  "Egg Parotta":      ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1610192773928-7692552431fa?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=300&fit=crop"],
  "Idiyappam":        ["https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1610192773928-7692552431fa?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop"],
  "Medu Vada":        ["https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1610192773928-7692552431fa?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop"],
  // Desserts
  "Mysurpa":          ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1666277011989-2f84e9f93498?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&h=300&fit=crop"],
  "Brownie Sundae":   ["https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop"],
  // Drinks
  "Paneer Soda":      ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop"],
  "Watermelon Juice": ["https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1497534446932-c925d26e4e91?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop"],
  // Pizza (all 5)
  "Margherita Pizza":     ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1590947132387-155cc3dd3bb1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop"],
  "Pepperoni Pizza":      ["https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1590947132387-155cc3dd3bb1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"],
  "BBQ Chicken Pizza":    ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1590947132387-155cc3dd3bb1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop"],
  "Veggie Supreme Pizza": ["https://images.unsplash.com/photo-1590947132387-155cc3dd3bb1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop"],
  "Cheese Burst Pizza":   ["https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop"],
  // Burger (all 5)
  "Chicken Zinger Burger": ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop"],
  "Classic Veg Burger":    ["https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop"],
  "Double Cheese Burger":  ["https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"],
  "Spicy Paneer Burger":   ["https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop"],
  "Mutton Patty Burger":   ["https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop"],
  // Chinese (all 6)
  "Chicken Fried Rice": ["https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop"],
  "Egg Noodles":        ["https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop"],
  "Gobi Manchurian":    ["https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop"],
  "Chilli Chicken":     ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop"],
  "Hakka Noodles":      ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop"],
  "Spring Roll":        ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"],
  // North Indian (all 6)
  "Butter Naan":          ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop"],
  "Garlic Naan":          ["https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop"],
  "Paneer Butter Masala": ["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop"],
  "Dal Makhani":          ["https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop"],
  "Tandoori Chicken":     ["https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop"],
  "Malai Kofta":          ["https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop"],
};

// Fetch images from Unsplash for a specific query, with curated fallback
const fetchImages = async (name, query, count = 10) => {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${UNSPLASH_KEY}&orientation=landscape`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((img) => img.urls.small);
    }
  } catch (err) {
    console.warn(`  ⚠ API failed for "${query}": ${err.message}`);
  }
  // Use curated fallback if available
  if (fallbackImages[name]) {
    return fallbackImages[name];
  }
  return [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
  ];
};

const seedDatabase = async () => {
  try {
    const mongoUri = "mongodb://gokulkannan7978_db_user:gokul_123@ac-wq9pxzc-shard-00-00.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-01.mwzr9vu.mongodb.net:27017,ac-wq9pxzc-shard-00-02.mwzr9vu.mongodb.net:27017/newproject_foodapp245?ssl=true&replicaSet=atlas-sjbzhi-shard-0&authSource=admin&appName=Cluster0";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB for seeding...");

    await Food.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑  Cleared existing data");

    const catDocs = categoryList.map((c) => ({ name: c.name, description: c.description, emoji: c.emoji }));
    await Category.insertMany(catDocs);
    console.log(`🏷  Seeded ${catDocs.length} categories`);

    // ── Step 1: Fetch images per sub-type ──────────────────────────────────
    // We batch queries: 10 at a time with a pause to stay under 50 req/hr
    const subTypeImages = {};
    const batchSize = 8;

    console.log(`\n📸 Fetching unique images for ${foodSubTypes.length} food sub-types...\n`);

    for (let b = 0; b < foodSubTypes.length; b += batchSize) {
      const batch = foodSubTypes.slice(b, b + batchSize);
      const promises = batch.map(async (st) => {
        const imgs = await fetchImages(st.name, st.q, 10);
        subTypeImages[st.name] = imgs;
        console.log(`  ✅ ${st.name} → ${imgs.length} unique images`);
      });
      await Promise.all(promises);

      // Pause between batches to respect rate limits
      if (b + batchSize < foodSubTypes.length) {
        console.log(`  ⏳ Pausing 2s before next batch...`);
        await sleep(2000);
      }
    }

    // ── Step 2: Generate 400 food items ────────────────────────────────────
    const foods = [];
    let imageIndex = 0; // global counter to avoid duplicate images across items

    for (const st of foodSubTypes) {
      const images = subTypeImages[st.name];
      // Generate ~7 variants per sub-type (62 sub-types × ~7 = ~434 items)
      const variantCount = Math.ceil(400 / foodSubTypes.length) + 1; // ~7-8

      for (let v = 0; v < variantCount; v++) {
        const adj = adjectives[v % adjectives.length];
        const suffix = v >= adjectives.length ? ` #${v + 1}` : "";
        const foodName = `${adj} ${st.name}${suffix}`;

        // Pick a UNIQUE image: rotate through the fetched images
        const img = images[v % images.length];

        foods.push({
          name: foodName,
          price: Math.floor(Math.random() * 250) + 50,
          category: st.category,
          rating: (Math.random() * 1.0 + 4.0).toFixed(1),
          time: `${Math.floor(Math.random() * 25) + 10} min`,
          image: img,
          description: `Enjoy our mouth-watering ${foodName}, made with the finest ingredients and authentic spices.`,
        });
      }
    }

    // Trim to exactly 400 if we have more
    const finalFoods = foods.slice(0, 400);

    await Food.insertMany(finalFoods);
    console.log(`\n🍽  Seeded ${finalFoods.length} food items with unique images!`);

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log("👤  Admin user created.");
    } else {
      console.log("👤  Admin already exists, skipping.");
    }

    console.log("\n✅ ALL SEEDING COMPLETED!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
