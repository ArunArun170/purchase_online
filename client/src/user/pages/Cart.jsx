import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // =========================
  // LOAD CART
  // =========================
  const loadCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(
          "anon_cart_items"
        ) || "[]"
      );

      setCart(
        Array.isArray(savedCart)
          ? savedCart
          : []
      );
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdated = () => {
      loadCart();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    window.addEventListener(
      "storage",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

      window.removeEventListener(
        "storage",
        handleCartUpdated
      );
    };
  }, []);

  // =========================
  // SAVE CART
  // =========================
  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "anon_cart_items",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = (
    index,
    change
  ) => {
    const updatedCart = [...cart];

    const newQuantity =
      Number(updatedCart[index].qty || 1) +
      change;

    if (newQuantity <= 0) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index] = {
        ...updatedCart[index],
        qty: newQuantity,
      };
    }

    saveCart(updatedCart);
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (index) => {
    const updatedCart = [...cart];

    updatedCart.splice(index, 1);

    saveCart(updatedCart);
  };

  // =========================
  // CALCULATIONS
  // =========================
  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.qty || 0),
      0
    );
  }, [cart]);

  const tax = subtotal * 0.05;

  const couponDiscount = couponApplied
    ? subtotal * 0.20
    : 0;

  const total = Math.max(
    0,
    subtotal +
      tax -
      couponDiscount
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.qty || 0),
    0
  );

  // =========================
  // COUPON
  // =========================
  const applyCoupon = () => {
    const value = coupon
      .trim()
      .toUpperCase();

    if (!value) {
      setCouponApplied(false);
      return;
    }

    if (value === "FRESH20") {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      alert("Invalid coupon code.");
    }
  };

  // =========================
  // PROCEED TO CHECKOUT
  // =========================
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const savedUser = JSON.parse(
        localStorage.getItem(
          "anon_user"
        ) || "null"
      );

      if (savedUser) {
        navigate("/checkout");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.error(
        "User check error:",
        error
      );

      navigate("/signin");
    }
  };

  // =========================
  // EMPTY CART
  // =========================
  if (cart.length === 0) {
    return (
      <main className="grow flex items-center justify-center px-5 py-16 md:py-24">

        <div className="w-full max-w-2xl">

          <div className="bg-white border border-[#e5e2e1] rounded-2xl shadow-sm p-8 md:p-14 text-center">

            <span className="material-symbols-outlined text-[70px] md:text-[80px] text-[#dfbfc1]">
              shopping_basket
            </span>

            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-[#1b1c1c] mt-5">
              Your cart is empty
            </h1>

            <p className="text-xs md:text-sm text-[#5e5e5e] max-w-sm mx-auto leading-relaxed mt-3">
              Looks like you haven't added
              anything to your cart yet.
              Start shopping to find fresh
              new arrivals.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/catalog")
              }
              className="mt-7 px-8 py-3.5 bg-[#ad2d47] text-white rounded-full font-bold hover:bg-[#8c1231] transition-all uppercase tracking-wider text-xs md:text-sm shadow-md active:scale-95"
            >
              Start Shopping Now
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="grow pb-24">

      {/* =========================
          CART CONTAINER
          ========================= */}
      <section className="max-w-[1200px] mx-auto px-5 py-6 md:py-10">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* =========================
              CART ITEMS
              ========================= */}
          <div className="flex-1 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-[#e5e2e1] pb-4">

              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                Your Shopping Cart
              </h1>

              <span className="font-semibold text-[#5e5e5e] text-sm">
                {totalItems} Items
              </span>

            </div>


            {/* Items */}
            <div className="space-y-4">

              {cart.map(
                (item, index) => {

                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.qty || 0);

                  const variantText = [];

                  if (item.color) {
                    variantText.push(
                      `Color: ${item.color}`
                    );
                  }

                  if (item.size) {
                    variantText.push(
                      `Size: ${item.size}`
                    );
                  }

                  return (
                    <div
                      key={`${item.id}-${item.color || ""}-${item.size || ""}-${index}`}
                      className="bg-white border border-[#e5e2e1] p-3 md:p-4 rounded-xl flex flex-row items-center gap-3 md:gap-5 hover:shadow-md transition-all"
                    >

                      {/* PRODUCT IMAGE */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/product/${item.id}`
                          )
                        }
                        className="w-16 h-16 md:w-24 md:h-24 bg-[#f0eded] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border border-[#dfbfc1]"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />

                      </button>


                      {/* PRODUCT INFO */}
                      <div className="flex-1 min-w-0">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/product/${item.id}`
                            )
                          }
                          className="font-bold text-xs md:text-sm text-[#1b1c1c] hover:text-[#ad2d47] text-left transition-colors line-clamp-2 leading-tight"
                        >
                          {item.name}
                        </button>

                        <p className="text-[9px] md:text-[11px] text-[#5e5e5e] mt-1 font-semibold">
                          {variantText.length >
                          0
                            ? variantText.join(
                                " | "
                              )
                            : "Standard Edition"}
                        </p>


                        {/* MOBILE TOTAL */}
                        <div className="flex items-center justify-between mt-2 md:hidden">

                          <span className="font-bold text-[#ad2d47] text-sm">
                            $
                            {itemTotal.toFixed(
                              2
                            )}
                          </span>

                        </div>

                      </div>


                      {/* DESKTOP TOTAL */}
                      <div className="hidden md:block flex-shrink-0">

                        <span className="font-bold text-[#ad2d47] text-lg">
                          $
                          {itemTotal.toFixed(
                            2
                          )}
                        </span>

                      </div>


                      {/* QUANTITY + REMOVE */}
                      <div className="flex flex-col items-end gap-2 md:gap-3 flex-shrink-0">

                        <div className="flex items-center border border-[#dfbfc1] rounded-full bg-white shadow-sm overflow-hidden h-7 md:h-9">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                index,
                                -1
                              )
                            }
                            className="w-7 md:w-9 h-full flex items-center justify-center text-[#5e5e5e] hover:bg-[#f0eded] hover:text-[#ad2d47] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                              remove
                            </span>
                          </button>


                          <span className="w-6 md:w-10 text-center font-bold text-xs md:text-sm select-none">
                            {item.qty}
                          </span>


                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                index,
                                1
                              )
                            }
                            className="w-7 md:w-9 h-full flex items-center justify-center text-[#5e5e5e] hover:bg-[#f0eded] hover:text-[#ad2d47] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                              add
                            </span>
                          </button>

                        </div>


                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          className="text-[#ba1a1a] text-[9px] md:text-[10px] font-bold uppercase flex items-center gap-0.5 hover:underline mt-1"
                        >
                          <span className="material-symbols-outlined text-[12px] md:text-[14px]">
                            delete
                          </span>

                          <span className="hidden md:inline">
                            Remove
                          </span>

                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>


          {/* =========================
              ORDER SUMMARY
              ========================= */}
          <aside className="w-full lg:w-[360px]">

            <div className="sticky top-[100px] bg-white p-6 rounded-2xl border border-[#e5e2e1] shadow-sm">

              <h2 className="text-lg font-bold uppercase mb-6 border-b border-[#e5e2e1] pb-4">
                Order Summary
              </h2>


              {/* COUPON */}
              <div className="mb-6">

                <label className="text-[10px] font-bold text-[#5e5e5e] uppercase block mb-2 tracking-wider">
                  Apply Coupon Code
                </label>

                <div className="flex gap-2">

                  <input
                    type="text"
                    value={coupon}
                    onChange={(event) =>
                      setCoupon(
                        event.target.value
                      )
                    }
                    placeholder="FRESH20"
                    className="flex-1 min-w-0 rounded-lg border border-[#dfbfc1] focus:border-[#ad2d47] focus:ring-1 focus:ring-[#ad2d47] px-3 py-2 text-sm outline-none bg-[#fcf9f8]"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-[#ad2d47] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#8c1231] active:scale-95 transition-all"
                  >
                    Apply
                  </button>

                </div>


                {couponApplied && (
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-2">
                    FRESH20 applied — 20%
                    discount
                  </p>
                )}

              </div>


              {/* AMOUNTS */}
              <div className="space-y-3 border-b border-[#e5e2e1] pb-6 mb-6">

                <div className="flex justify-between text-sm">

                  <span className="text-[#5e5e5e] font-medium">
                    Subtotal
                  </span>

                  <span className="font-bold text-[#1b1c1c]">
                    ${subtotal.toFixed(2)}
                  </span>

                </div>


                <div className="flex justify-between text-sm">

                  <span className="text-[#5e5e5e] font-medium">
                    Delivery Fee
                  </span>

                  <span className="font-bold text-[#ad2d47]">
                    FREE
                  </span>

                </div>


                <div className="flex justify-between text-sm">

                  <span className="text-[#5e5e5e] font-medium">
                    Estimated Tax (5%)
                  </span>

                  <span className="font-bold text-[#1b1c1c]">
                    ${tax.toFixed(2)}
                  </span>

                </div>


                {couponApplied && (
                  <div className="flex justify-between text-sm">

                    <span className="text-green-600 font-medium">
                      Coupon Discount
                    </span>

                    <span className="font-bold text-green-600">
                      -$
                      {couponDiscount.toFixed(
                        2
                      )}
                    </span>

                  </div>
                )}

              </div>


              {/* TOTAL */}
              <div className="flex justify-between items-end mb-6">

                <span className="font-bold text-lg uppercase tracking-wide">
                  Total Amount
                </span>

                <div className="text-right">

                  <p className="text-2xl md:text-3xl font-bold text-[#ad2d47]">
                    ${total.toFixed(2)}
                  </p>

                  <p className="text-[10px] font-bold text-green-600 mt-1 uppercase tracking-wider">
                    Tax Included
                  </p>

                </div>

              </div>


              {/* =========================
                  PROCEED
                  ========================= */}
              <button
                type="button"
                onClick={
                  proceedToCheckout
                }
                className="w-full bg-[#ad2d47] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#8c1231] active:scale-95 transition-all uppercase tracking-wider text-sm flex justify-center items-center gap-2"
              >

                Proceed to Checkout

                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>

              </button>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default Cart;