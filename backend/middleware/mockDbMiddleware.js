// swiftbite-backend/middleware/mockDbMiddleware.js
// A fully functional, zero-install, zero-download database engine in memory.
// Mimics the exact behavior of our Mongoose MongoDB database.

const foodsData = [
  // Veg
  { _id: "f1", name: "Paneer Butter Masala",   price: 280, category: "Veg",      rating: 4.5, time: "25 min", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop", description: "Rich and creamy paneer curry with aromatic butter sauce", isAvailable: true },
  { _id: "f2", name: "Dal Makhani",            price: 249, category: "Veg",      rating: 4.4, time: "30 min", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", description: "Slow-cooked black lentils with butter and cream", isAvailable: true },
  { _id: "f3", name: "Palak Paneer",           price: 260, category: "Veg",      rating: 4.4, time: "25 min", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", description: "Cottage cheese cubes in smooth, spiced spinach gravy", isAvailable: true },
  { _id: "f4", name: "Chole Bhature",          price: 179, category: "Veg",      rating: 4.6, time: "20 min", image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&h=300&fit=crop", description: "Spiced chickpea curry served with deep-fried fluffy bread", isAvailable: true },
  { _id: "f5", name: "Veg Burger",             price: 179, category: "Veg",      rating: 4.2, time: "15 min", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop", description: "Crispy veggie patty with fresh lettuce and special sauce", isAvailable: true },
  { _id: "f6", name: "Mushroom Risotto",       price: 299, category: "Veg",      rating: 4.5, time: "35 min", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop", description: "Creamy Italian rice cooked with wild mushrooms and parmesan", isAvailable: true },
  { _id: "f7", name: "Pav Bhaji",              price: 159, category: "Veg",      rating: 4.5, time: "20 min", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop", description: "Spicy mashed vegetable curry served with buttered pav buns", isAvailable: true },
  { _id: "f8", name: "Veg Biryani",            price: 249, category: "Veg",      rating: 4.3, time: "35 min", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop", description: "Fragrant basmati rice layered with spiced vegetables and saffron", isAvailable: true },
  
  // Non-Veg
  { _id: "f9", name: "Chicken Biryani",        price: 349, category: "Non-Veg",  rating: 4.7, time: "35 min", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", description: "Aromatic basmati rice cooked with tender chicken pieces", isAvailable: true },
  { _id: "f10", name: "Butter Chicken",         price: 320, category: "Non-Veg",  rating: 4.6, time: "30 min", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop", description: "Tender chicken in a rich, creamy tomato-based curry", isAvailable: true },
  { _id: "f11", name: "Chicken Tikka",          price: 329, category: "Non-Veg",  rating: 4.7, time: "30 min", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", description: "Marinated chicken chunks grilled to smoky perfection", isAvailable: true },
  { _id: "f12", name: "Mutton Rogan Josh",      price: 399, category: "Non-Veg",  rating: 4.8, time: "45 min", image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop", description: "Tender mutton slow-cooked in Kashmiri aromatic spices", isAvailable: true },
  { _id: "f13", name: "Prawn Masala",           price: 379, category: "Non-Veg",  rating: 4.6, time: "30 min", image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop", description: "Juicy prawns cooked in a tangy coastal spice masala", isAvailable: true },
  { _id: "f14", name: "Grilled Fish Tacos",     price: 299, category: "Non-Veg",  rating: 4.3, time: "25 min", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", description: "Soft tacos filled with grilled fish, slaw and chipotle mayo", isAvailable: true },
  
  // Starters
  { _id: "f15", name: "Veg Spring Rolls",       price: 149, category: "Starters", rating: 4.3, time: "15 min", image: "https://images.unsplash.com/photo-1548611635-29bafca01e01?w=400&h=300&fit=crop", description: "Crispy rolls filled with seasoned vegetables and glass noodles", isAvailable: true },
  { _id: "f16", name: "Samosa (2 pcs)",         price: 79,  category: "Starters", rating: 4.5, time: "10 min", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", description: "Golden fried pastry filled with spiced potatoes and peas", isAvailable: true },
  { _id: "f17", name: "French Fries",           price: 99,  category: "Starters", rating: 4.2, time: "10 min", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop", description: "Crispy golden fries seasoned with sea salt and herbs", isAvailable: true },
  
  // Breads
  { _id: "f18", name: "Butter Naan",            price: 49,  category: "Breads",   rating: 4.5, time: "10 min", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop", description: "Soft leavened bread baked in tandoor and brushed with butter", isAvailable: true },
  { _id: "f19", name: "Garlic Naan",            price: 59,  category: "Breads",   rating: 4.6, time: "10 min", image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop", description: "Tandoor-baked naan topped with minced garlic and coriander", isAvailable: true },
  
  // Desserts
  { _id: "f20", name: "Chocolate Lava Cake",    price: 199, category: "Desserts", rating: 4.8, time: "20 min", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop", description: "Warm chocolate cake with a molten gooey center", isAvailable: true },
  { _id: "f21", name: "Gulab Jamun",            price: 99,  category: "Desserts", rating: 4.5, time: "15 min", image: "https://images.unsplash.com/photo-1666277011989-2f84e9f93498?w=400&h=300&fit=crop", description: "Soft milk-solid balls soaked in rose-flavored sugar syrup", isAvailable: true },
  { _id: "f22", name: "Cheesecake Slice",       price: 219, category: "Desserts", rating: 4.7, time: "10 min", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop", description: "Classic New York style cheesecake with berry compote", isAvailable: true },
  { _id: "f23", name: "Brownie Sundae",         price: 249, category: "Desserts", rating: 4.9, time: "15 min", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop", description: "Warm fudge brownie topped with vanilla ice cream and chocolate sauce", isAvailable: true },
  
  // Drinks
  { _id: "f24", name: "Mango Lassi",            price: 129, category: "Drinks",   rating: 4.6, time: "10 min", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop", description: "Refreshing yogurt-based drink blended with fresh mango pulp", isAvailable: true },
  { _id: "f25", name: "Cold Coffee",            price: 149, category: "Drinks",   rating: 4.4, time: "10 min", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop", description: "Chilled coffee blended with milk and sugar", isAvailable: true },
  { _id: "f26", name: "Fresh Lime Soda",        price: 89,  category: "Drinks",   rating: 4.3, time: "5 min",  image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop", description: "Fizzy and refreshing lime soda with a hint of mint", isAvailable: true },
];

const mockUsers = [
  { _id: "u1", name: "SwiftBite Admin", email: "admin@swiftbite.com", passwordHash: "$2a$10$xxxx", role: "admin" },
  { _id: "u2", name: "Gokul", email: "gokul@gmail.com", passwordHash: "$2a$10$xxxx", role: "customer" }
];

const mockOrders = [];

const mockApiMiddleware = (req, res, next) => {
  // If we aren't in mock mode, bypass immediately
  if (process.env.MOCK_DATABASE !== "true") {
    return next();
  }

  const url = req.url;
  const method = req.method;

  console.log(`⚡ [Virtual DB Router] Intercepted: ${method} ${url}`);

  // Helpers to simulate request latency (100ms)
  const delayResponse = (status, payload) => {
    setTimeout(() => {
      res.status(status).json(payload);
    }, 150);
  };

  // Helper for auth validation
  const getMockCurrentUser = () => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    if (token === "mock-admin-token") return mockUsers[0];
    if (token === "mock-gokul-token") return mockUsers[1];
    if (token.startsWith("mock-user-")) {
      const userId = token.replace("mock-user-", "");
      return mockUsers.find(u => u._id === userId) || null;
    }
    return null;
  };

  // ─── 1. FOOD ENDPOINTS ──────────────────────────────────────────────────────
  if (url.startsWith("/api/foods")) {
    // 1a. GET categories
    if (url === "/api/foods/categories") {
      return delayResponse(200, {
        success: true,
        categories: ["All", "Veg", "Non-Veg", "Desserts", "Drinks", "Starters", "Breads"]
      });
    }

    // 1b. GET single item
    const singleFoodMatch = url.match(/\/api\/foods\/([a-zA-Z0-9]+)$/);
    if (singleFoodMatch && method === "GET") {
      const foodId = singleFoodMatch[1];
      const food = foodsData.find(f => f._id === foodId);
      if (!food) {
        return delayResponse(404, { success: false, message: "Food not found." });
      }
      return delayResponse(200, { success: true, food });
    }

    // 1c. GET all foods (supports search, sort, filter, pagination)
    if (method === "GET") {
      const queryParams = new URLSearchParams(url.split("?")[1] || "");
      const category = queryParams.get("category") || "All";
      const search = queryParams.get("search") || "";
      const sort = queryParams.get("sort") || "default";
      const page = parseInt(queryParams.get("page") || "1", 10);
      const limit = parseInt(queryParams.get("limit") || "20", 10);

      let items = [...foodsData];

      // Filter by category
      if (category !== "All") {
        items = items.filter(f => f.category.toLowerCase() === category.toLowerCase());
      }

      // Filter by search
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(f => 
          f.name.toLowerCase().includes(q) || 
          f.description.toLowerCase().includes(q) || 
          f.category.toLowerCase().includes(q)
        );
      }

      // Sort
      if (sort === "low") {
        items.sort((a, b) => a.price - b.price);
      } else if (sort === "high") {
        items.sort((a, b) => b.price - a.price);
      } else if (sort === "rating") {
        items.sort((a, b) => b.rating - a.rating);
      }

      // Paginate
      const total = items.length;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedItems = items.slice(startIndex, endIndex);

      return delayResponse(200, {
        success: true,
        total,
        page,
        pages: Math.ceil(total / limit),
        count: paginatedItems.length,
        foods: paginatedItems
      });
    }
  }

  // ─── 2. AUTH ENDPOINTS ──────────────────────────────────────────────────────
  if (url.startsWith("/api/auth")) {
    // 2a. POST register
    if (url === "/api/auth/register" && method === "POST") {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return delayResponse(400, { success: false, message: "Please fill in all fields" });
      }
      
      const existing = mockUsers.find(u => u.email === email);
      if (existing) {
        return delayResponse(400, { success: false, message: "User already exists with this email" });
      }

      const newUser = {
        _id: "u" + (mockUsers.length + 1),
        name,
        email,
        role: "customer"
      };
      mockUsers.push(newUser);

      return delayResponse(201, {
        success: true,
        token: `mock-user-${newUser._id}`,
        user: newUser
      });
    }

    // 2b. POST login
    if (url === "/api/auth/login" && method === "POST") {
      const { email, password } = req.body;
      
      // Seed pre-defined admin bypass
      if (email === "admin@swiftbite.com") {
        return delayResponse(200, {
          success: true,
          token: "mock-admin-token",
          user: mockUsers[0]
        });
      }

      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        return delayResponse(400, { success: false, message: "Invalid credentials" });
      }

      return delayResponse(200, {
        success: true,
        token: `mock-user-${user._id}`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // 2c. GET profile
    if (url === "/api/auth/profile" && method === "GET") {
      const currentUser = getMockCurrentUser();
      if (!currentUser) {
        return delayResponse(401, { success: false, message: "Not authorized" });
      }
      return delayResponse(200, {
        success: true,
        user: {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        }
      });
    }
  }

  // ─── 3. ORDER ENDPOINTS ─────────────────────────────────────────────────────
  if (url.startsWith("/api/orders")) {
    // Authenticate
    const currentUser = getMockCurrentUser();
    if (!currentUser) {
      return delayResponse(401, { success: false, message: "Not authorized to access orders" });
    }

    // 3a. GET my orders
    if (url === "/api/orders/my" && method === "GET") {
      const userOrders = mockOrders.filter(o => o.user === currentUser._id);
      return delayResponse(200, { success: true, count: userOrders.length, orders: userOrders });
    }

    // 3b. POST create order
    if (url === "/api/orders" && method === "POST") {
      const { items, deliveryAddress, paymentMethod } = req.body;
      if (!items || items.length === 0 || !deliveryAddress) {
        return delayResponse(400, { success: false, message: "Missing order details" });
      }

      // Map items with prices
      let totalAmount = 0;
      const orderItems = items.map(oItem => {
        const food = foodsData.find(f => f._id === oItem.food);
        if (food) {
          totalAmount += food.price * oItem.quantity;
          return {
            food: {
              _id: food._id,
              name: food.name,
              price: food.price,
              image: food.image
            },
            quantity: oItem.quantity
          };
        }
        return null;
      }).filter(Boolean);

      const deliveryFee = 49;
      const taxes = Math.round(totalAmount * 0.05);
      const grandTotal = totalAmount + deliveryFee + taxes;

      const newOrder = {
        _id: "ord" + (mockOrders.length + 1),
        user: currentUser._id,
        items: orderItems,
        deliveryAddress,
        paymentMethod: paymentMethod || "COD",
        subtotal: totalAmount,
        deliveryFee,
        taxes,
        totalAmount: grandTotal,
        status: "Placed",
        placedAt: new Date().toISOString()
      };

      mockOrders.push(newOrder);

      return delayResponse(201, {
        success: true,
        message: "Order placed successfully",
        order: newOrder
      });
    }
  }

  // Route not matched by virtual DB but we are in mock mode, return 404
  return delayResponse(404, { success: false, message: `Route ${url} not mock-implemented.` });
};

module.exports = mockApiMiddleware;
