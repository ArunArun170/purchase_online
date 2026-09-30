import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const loadCartCount = () => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("anon_cart_items") || "[]"
      );

      const count = cart.reduce(
        (total, item) => total + Number(item.qty || 0),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error("Failed to load cart count:", error);
      setCartCount(0);
    }
  };

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("anon_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadCartCount();
    loadUser();

    const handleCartUpdated = () => {
      loadCartCount();
    };

    const handleAuthUpdated = () => {
      loadUser();
    };

    const handleStorage = () => {
      loadCartCount();
      loadUser();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("authUpdated", handleAuthUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("authUpdated", handleAuthUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const shouldLogout = window.confirm(
      `Logout from ${user.name || user.email || "your account"}?`
    );

    if (!shouldLogout) {
      return;
    }

    localStorage.removeItem("anon_user");
    localStorage.removeItem("anon_token");

    setUser(null);

    window.dispatchEvent(new Event("authUpdated"));

    if (
      location.pathname === "/checkout" ||
      location.pathname === "/order-success"
    ) {
      navigate("/");
    }
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e5dfdc] bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid h-[64px] max-w-[500px] grid-cols-4">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive("/")
              ? "text-[#1b1c1c]"
              : "text-[#8b847f]"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[23px] ${
              isActive("/") ? "font-semibold" : ""
            }`}
          >
            home
          </span>

          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Catalog */}
        <Link
          to="/catalog"
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive("/catalog")
              ? "text-[#1b1c1c]"
              : "text-[#8b847f]"
          }`}
        >
          <span className="material-symbols-outlined text-[23px]">
            grid_view
          </span>

          <span className="text-[10px] font-medium">Catalog</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center justify-center gap-1 ${
            isActive("/cart")
              ? "text-[#1b1c1c]"
              : "text-[#8b847f]"
          }`}
        >
          <span className="relative">
            <span className="material-symbols-outlined text-[23px]">
              shopping_bag
            </span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#1b1c1c] px-1 text-[9px] font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>

          <span className="text-[10px] font-medium">Cart</span>
        </Link>

        {/* Account */}
        <button
          type="button"
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center gap-1 ${
            user
              ? "text-[#1b1c1c]"
              : "text-[#8b847f]"
          }`}
        >
          {user ? (
            <span className="flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#1b1c1c] text-[10px] font-semibold text-white">
              {getUserInitial()}
            </span>
          ) : (
            <span className="material-symbols-outlined text-[23px]">
              person
            </span>
          )}

          <span className="text-[10px] font-medium">Account</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomNav;