
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";

import Header from "./user/components/Header";
import Footer from "./user/components/Footer";
import MobileBottomNav from "./user/components/MobileBottomNav";

import Home from "./user/pages/Home";
import Catalog from "./user/pages/Catalog";
import ProductDetails from "./user/pages/ProductDetails";
import Cart from "./user/pages/Cart";
import SignIn from "./user/pages/SignIn";
import SignUp from "./user/pages/SignUp";
import Checkout from "./user/pages/Checkout";
import OrderSuccess from "./user/pages/OrderSuccess";

import Admin from "./admin/pages/Admin";

function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1b1c1c]">
      <Header />

      <div className="flex-1">
        {children}
      </div>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}


function AdminGuard({ children }) {
  const user = JSON.parse(localStorage.getItem("anon_user") || "null");
  const token = localStorage.getItem("anon_token");

  if (!token || user?.role !== "admin") {
    window.location.replace("/signin");
    return null;
  }

  return children;
}

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#1b1c1c]">
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            CUSTOMER WEBSITE
            ========================= */}

        <Route
          path="/"
          element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          }
        />

        <Route
          path="/catalog"
          element={
            <CustomerLayout>
              <Catalog />
            </CustomerLayout>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <CustomerLayout>
              <ProductDetails />
            </CustomerLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <CustomerLayout>
              <Cart />
            </CustomerLayout>
          }
        />

        <Route
          path="/signin"
          element={
            <CustomerLayout>
              <SignIn />
            </CustomerLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <CustomerLayout>
              <SignUp />
            </CustomerLayout>
          }
        />

        <Route
          path="/checkout"
          element={
            <CustomerLayout>
              <Checkout />
            </CustomerLayout>
          }
        />

        <Route
          path="/order-success"
          element={
            <CustomerLayout>
              <OrderSuccess />
            </CustomerLayout>
          }
        />

        {/* =========================
            ADMIN WEBSITE
            ========================= */}

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </AdminGuard>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
