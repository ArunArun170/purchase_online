import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState("");
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

  const handleSearch = (e) => {
    e.preventDefault();

    const search = searchValue.trim();

    if (!search) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(search)}`);
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
    <header className="sticky top-0 z-50 border-b border-[#e8e2df] bg-white">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 text-[24px] font-bold tracking-[-0.5px] text-[#1b1c1c]"
        >
          Anon.
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden min-w-0 flex-1 md:block"
        >
          <div className="mx-auto flex max-w-[650px] items-center rounded-full border border-[#ddd6d2] bg-[#f7f4f2] px-4">
            <span className="material-symbols-outlined mr-2 text-[22px] text-[#77706c]">
              search
            </span>

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="h-[42px] w-full bg-transparent text-[14px] text-[#1b1c1c] outline-none placeholder:text-[#918985]"
            />
          </div>
        </form>

        {/* Desktop Account */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="hidden shrink-0 items-center gap-2 rounded-full px-2 py-2 transition hover:bg-[#f6f2f0] sm:flex"
          title={user ? "Logout" : "Sign in"}
        >
          {user ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b1c1c] text-[14px] font-semibold text-white">
              {getUserInitial()}
            </span>
          ) : (
            <span className="material-symbols-outlined text-[24px] text-[#1b1c1c]">
              person
            </span>
          )}

          <span className="hidden xl:block text-[13px] font-medium text-[#1b1c1c]">
            {user ? user.name || "Account" : "Account"}
          </span>
        </button>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-[#f6f2f0]"
          title="Cart"
        >
          <span className="material-symbols-outlined text-[24px] text-[#1b1c1c]">
            shopping_bag
          </span>

          {cartCount > 0 && (
            <span className="absolute right-0 top-0 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1b1c1c] px-1 text-[10px] font-semibold text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

       {/* 
        <nav className="hidden lg:flex items-center gap-5 pl-2">
          <Link
            to="/"
            className={`text-[13px] font-medium transition ${
              location.pathname === "/"
                ? "text-[#1b1c1c]"
                : "text-[#746d69] hover:text-[#1b1c1c]"
            }`}
          >
            Home
          </Link>

          <Link
            to="/catalog"
            className={`text-[13px] font-medium transition ${
              location.pathname === "/catalog"
                ? "text-[#1b1c1c]"
                : "text-[#746d69] hover:text-[#1b1c1c]"
            }`}
          >
            Shop
          </Link>
        </nav> */}
      </div>

      {/* Mobile Search */}
      <div className="border-t border-[#eee8e5] bg-white px-4 py-3 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="flex items-center rounded-full border border-[#ddd6d2] bg-[#f7f4f2] px-4">
            <span className="material-symbols-outlined mr-2 text-[21px] text-[#77706c]">
              search
            </span>

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="h-[40px] w-full bg-transparent text-[14px] text-[#1b1c1c] outline-none placeholder:text-[#918985]"
            />
          </div>
        </form>
      </div>
    </header>
  );
}

export default Header;