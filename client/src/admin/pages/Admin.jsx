import { useEffect, useMemo, useState } from "react";
import Orders from "./Orders";
import Products from "./Products";
import Categories from "./Categories";
import Ads from "./Ads";

function Admin() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [database, setDatabase] =
    useState(null);

  const [orders, setOrders] =
    useState([]);

  const [accounts, setAccounts] =
    useState([]);

  const [ads, setAds] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [
          productsResponse,
          categoriesResponse,
          slidesResponse,
          ordersResponse,
          accountsResponse,
          adsResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/categories"),
          fetch("http://localhost:5000/api/hero-slides"),
          fetch("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}` } }),
          fetch("http://localhost:5000/api/auth/accounts", {
            headers: { Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}` },
          }),
          fetch("http://localhost:5000/api/ads"),
        ]);

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const slidesData = await slidesResponse.json();
        const ordersData = await ordersResponse.json();
        const accountsData = await accountsResponse.json();
        const adsData = await adsResponse.json();

        setDatabase({
          products: Array.isArray(productsData) ? productsData : [],
          categories: Array.isArray(categoriesData) ? categoriesData : [],
          hero_slides: Array.isArray(slidesData) ? slidesData : [],
        });

        setOrders(
          Array.isArray(ordersData)
            ? ordersData
            : []
        );

        setAccounts(
          Array.isArray(accountsData)
            ? accountsData
            : []
        );

        setAds(
          adsData || {}
        );

      } catch (error) {
        console.error(
          "Admin data loading error:",
          error
        );

        setDatabase({
          categories: [],
          hero_slides: [],
          products: [],
        });

        setOrders([]);
        setAccounts([]);

        setAds({
          testimonial: {},
          mid_image: {},
          ad_images: [],
        });

      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const products =
    Array.isArray(
      database?.products
    )
      ? database.products
      : [];

  const categories =
    Array.isArray(
      database?.categories
    )
      ? database.categories
      : [];

  const heroSlides =
    Array.isArray(
      database?.hero_slides
    )
      ? database.hero_slides
      : [];

  const totalSales = useMemo(() => {
    return orders.reduce(
      (total, order) => {
        const amount =
          Number(
            order.total_price ??
              order.total ??
              order.total_amount ??
              order.amount ??
              0
          );

        return total + amount;
      },
      0
    );
  }, [orders]);

  const recentOrders =
    orders.slice(0, 5);

  const pageTitles = {
    dashboard:
      "Dashboard Overview",

    orders:
      "Order Management",

    products:
      "Product Inventory",

    categories:
      "Categories & Slides",

    ads:
      "Marketing Ads",
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      shortLabel: "Home",
      icon: "dashboard",
    },
    {
      id: "orders",
      label: "Orders",
      shortLabel: "Orders",
      icon: "shopping_cart",
    },
    {
      id: "products",
      label: "Products",
      shortLabel: "Products",
      icon: "inventory_2",
    },
    {
      id: "categories",
      label: "Categories",
      shortLabel: "Categories",
      icon: "category",
    },
    {
      id: "ads",
      label: "Marketing Ads",
      shortLabel: "Ads",
      icon: "campaign",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">

        <div className="flex items-center gap-3 text-[#ad2d47]">

          <span className="material-symbols-outlined animate-spin text-[28px]">
            sync
          </span>

          <span className="font-bold">
            Loading Admin Dashboard...
          </span>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      {/* =========================
          DESKTOP SIDEBAR
          ========================= */}

      <aside className="hidden lg:flex w-[250px] bg-white border-r border-[#e5e7eb] flex-col fixed left-0 top-0 bottom-0 z-40">

        <div className="h-[76px] px-6 flex items-center border-b border-[#e5e7eb]">

          <div>

            <h1 className="text-xl font-extrabold text-[#ad2d47] tracking-tight">
              ANON
            </h1>

            <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-[0.15em]">
              Admin Panel
            </p>

          </div>

        </div>


        <nav className="flex-1 p-4 space-y-1">

          {navigationItems.map(
            (item) => {

              const active =
                activePage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActivePage(
                      item.id
                    )
                  }
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-[#ad2d47]/10 text-[#ad2d47] font-bold border-r-4 border-[#ad2d47]"
                      : "text-[#5e6268] hover:bg-[#f5f5f5]"
                  }`}
                >

                  <span className="material-symbols-outlined mr-3 text-[21px]">
                    {item.icon}
                  </span>

                  {item.label}

                </button>
              );
            }
          )}

        </nav>


        <div className="p-4 border-t border-[#e5e7eb]">

          <button
            type="button"
            onClick={() =>
              window.location.href = "/"
            }
            className="w-full flex items-center px-4 py-3 rounded-lg text-sm text-[#5e6268] hover:bg-[#f5f5f5]"
          >

            <span className="material-symbols-outlined mr-3 text-[20px]">
              storefront
            </span>

            View Store

          </button>

        </div>

      </aside>


      {/* =========================
          MAIN
          ========================= */}

      <main className="flex-1 lg:ml-[250px] pb-[78px] lg:pb-0">

        {/* =========================
            HEADER
            ========================= */}

        <header className="h-[76px] bg-white border-b border-[#e5e7eb] px-5 md:px-8 flex items-center justify-between sticky top-0 z-30">

          <div className="min-w-0">

            <h2 className="text-xl md:text-2xl font-bold truncate">
              {pageTitles[activePage]}
            </h2>

            <p className="text-xs text-[#6b7280] mt-1 truncate">
              Manage your e-commerce website
            </p>

          </div>


          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f8f9fa]">

            <span className="material-symbols-outlined text-[19px] text-[#ad2d47]">
              admin_panel_settings
            </span>

            <span className="text-xs font-bold">
              Administrator
            </span>

          </div>

        </header>


        {/* =========================
            PAGE CONTENT
            ========================= */}

        <div className="p-4 md:p-8">

          {/* =========================
              DASHBOARD
              ========================= */}

          {activePage === "dashboard" && (
            <>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    Total Orders
                  </p>

                  <p className="text-2xl font-extrabold mt-2">
                    {orders.length}
                  </p>

                </div>


                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    Products
                  </p>

                  <p className="text-2xl font-extrabold mt-2">
                    {products.length}
                  </p>

                </div>


                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    Customers
                  </p>

                  <p className="text-2xl font-extrabold mt-2">
                    {accounts.length}
                  </p>

                </div>


                <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                    Total Sales
                  </p>

                  <p className="text-2xl font-extrabold mt-2">
                    ₹
                    {totalSales.toFixed(
                      2
                    )}
                  </p>

                </div>

              </div>


              <div className="mt-8 bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">

                <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-lg">
                      Recent Orders
                    </h3>

                    <p className="text-xs text-[#6b7280] mt-1">
                      Latest customer orders
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      setActivePage(
                        "orders"
                      )
                    }
                    className="text-xs font-bold text-[#ad2d47] hover:underline"
                  >
                    View All
                  </button>

                </div>


                {recentOrders.length ===
                0 ? (

                  <div className="py-12 text-center">

                    <span className="material-symbols-outlined text-[45px] text-[#c4c7ca]">
                      shopping_cart
                    </span>

                    <p className="mt-3 text-sm text-[#6b7280]">
                      No orders available
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead className="bg-[#f8f9fa]">

                        <tr>

                          <th className="text-left px-5 py-4">
                            Order ID
                          </th>

                          <th className="text-left px-5 py-4">
                            Customer
                          </th>

                          <th className="text-left px-5 py-4">
                            Date
                          </th>

                          <th className="text-left px-5 py-4">
                            Status
                          </th>

                          <th className="text-right px-5 py-4">
                            Total
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {recentOrders.map(
                          (
                            order,
                            index
                          ) => {

                            const customerName =
                              order.customer_name ||
                              order.customer?.name ||
                              order.name ||
                              "Customer";

                            const customerEmail =
                              order.customer_email ||
                              order.customer?.email ||
                              order.email ||
                              "";

                            const orderTotal =
                              Number(
                                order.total_price ??
                                  order.total ??
                                  order.total_amount ??
                                  order.amount ??
                                  0
                              );

                            return (
                              <tr
                                key={`${order.id || order.order_id}-${index}`}
                                className="border-t border-[#f0f1f2]"
                              >

                                <td className="px-5 py-4 font-bold">
                                  {order.id ||
                                    order.order_id ||
                                    "N/A"}
                                </td>

                                <td className="px-5 py-4">

                                  <div className="font-bold">
                                    {
                                      customerName
                                    }
                                  </div>

                                  <div className="text-xs text-[#6b7280]">
                                    {
                                      customerEmail
                                    }
                                  </div>

                                </td>

                                <td className="px-5 py-4">
                                  {order.date ||
                                    order.created_at ||
                                    "—"}
                                </td>

                                <td className="px-5 py-4">
                                  {order.status ||
                                    "Processing"}
                                </td>

                                <td className="px-5 py-4 text-right font-bold">
                                  ₹
                                  {orderTotal.toFixed(
                                    2
                                  )}
                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>


              <div className="mt-8">

                <h3 className="font-bold text-lg mb-4">
                  Quick Management
                </h3>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {[
                    [
                      "orders",
                      "shopping_cart",
                      "Manage Orders",
                      "View and manage customer orders",
                    ],
                    [
                      "products",
                      "inventory_2",
                      "Product Inventory",
                      "Add and manage products",
                    ],
                    [
                      "categories",
                      "category",
                      "Categories",
                      "Manage categories and slides",
                    ],
                    [
                      "ads",
                      "campaign",
                      "Marketing Ads",
                      "Manage website advertisements",
                    ],
                  ].map(
                    (item) => (

                      <button
                        key={item[0]}
                        type="button"
                        onClick={() =>
                          setActivePage(
                            item[0]
                          )
                        }
                        className="bg-white border border-[#e5e7eb] rounded-xl p-5 text-left hover:border-[#ad2d47] hover:shadow-sm transition-all"
                      >

                        <span className="material-symbols-outlined text-[#ad2d47]">
                          {item[1]}
                        </span>

                        <h4 className="font-bold mt-3">
                          {item[2]}
                        </h4>

                        <p className="text-xs text-[#6b7280] mt-1">
                          {item[3]}
                        </p>

                      </button>

                    )
                  )}

                </div>

              </div>

            </>
          )}


          {/* =========================
              ORDERS
              ========================= */}

          {activePage === "orders" && (
            <Orders />
          )}


          {/* =========================
              PRODUCTS
              ========================= */}

          {activePage === "products" && (
            <Products
              initialProducts={
                products
              }
              categories={
                categories
              }
            />
          )}


          {/* =========================
              CATEGORIES
              ========================= */}

          {activePage === "categories" && (
            <Categories
              initialCategories={
                categories
              }
              initialHeroSlides={
                heroSlides
              }
            />
          )}


          {/* =========================
              MARKETING ADS
              ========================= */}

          {activePage === "ads" && (
            <Ads
              initialAds={ads}
            />
          )}

        </div>

      </main>


      {/* =========================
          MOBILE BOTTOM NAVIGATION
          ========================= */}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e7eb] shadow-[0_-4px_15px_rgba(0,0,0,0.06)]">

        <div className="grid grid-cols-5 h-[68px]">

          {navigationItems.map(
            (item) => {

              const active =
                activePage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActivePage(
                      item.id
                    )
                  }
                  className={`flex flex-col items-center justify-center gap-1 transition-all ${
                    active
                      ? "text-[#ad2d47]"
                      : "text-[#7a7f85]"
                  }`}
                >

                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      active
                        ? "font-bold"
                        : ""
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`text-[10px] ${
                      active
                        ? "font-extrabold"
                        : "font-semibold"
                    }`}
                  >
                    {item.shortLabel}
                  </span>

                  {active && (
                    <span className="absolute bottom-0 h-[3px] w-10 rounded-t-full bg-[#ad2d47]" />
                  )}

                </button>
              );
            }
          )}

        </div>

      </nav>

    </div>
  );
}

export default Admin;