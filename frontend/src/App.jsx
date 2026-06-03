import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import OrderModal from "./components/OrderModal";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          {/* Global modal — sits above everything */}
          <OrderModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
