import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [activeStep, setActiveStep] = useState("address");

  const [checkoutLoading, setCheckoutLoading] =
    useState(true);

  const [orderLoading, setOrderLoading] =
    useState(false);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(
          "anon_cart_items"
        ) || "[]"
      );

      const savedUser = JSON.parse(
        localStorage.getItem(
          "anon_user"
        ) || "null"
      );

      setCart(
        Array.isArray(savedCart)
          ? savedCart
          : []
      );

      setUser(savedUser);
    } catch (error) {
      console.error(
        "Checkout loading error:",
        error
      );

      setCart([]);
      setUser(null);
    } finally {
      setCheckoutLoading(false);
    }
  }, []);

  // =========================
  // CHECK CART AFTER DATA LOAD
  // =========================
  useEffect(() => {
    if (
      checkoutLoading ||
      orderLoading
    ) {
      return;
    }

    if (cart.length === 0) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [
    cart,
    checkoutLoading,
    orderLoading,
    navigate,
  ]);

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

  const total = subtotal + tax;

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.qty || 0),
    0
  );

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async () => {
    if (orderLoading) {
      return;
    }

    if (!user) {
      navigate("/signin");
      return;
    }

    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    setOrderLoading(true);

    try {
      const response = await fetch(
        "https://purchase-online.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}`,
          },
          body: JSON.stringify({
            customer: user,
            items: cart,
            total_items: totalItems,
            subtotal,
            tax,
            total,
            payment_method: "Cash on Delivery",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order"
        );
      }

      localStorage.setItem(
        "anon_last_order",
        JSON.stringify(data)
      );

      localStorage.setItem(
        "anon_cart_items",
        JSON.stringify([])
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      navigate(
        `/order-success?order=${encodeURIComponent(
          data.order_id
        )}`,
        { replace: true }
      );
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      window.alert(
        error.message ||
          "Unable to place the order. Please try again."
      );
    } finally {
      setOrderLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (checkoutLoading) {
    return (
      <main className="grow flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#ad2d47]">
          <span className="material-symbols-outlined text-[28px] animate-spin">
            sync
          </span>

          <span className="font-bold">
            Loading Checkout...
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="grow">

      <section className="max-w-[1200px] mx-auto px-5 py-6 md:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* =========================
              LEFT CHECKOUT
              ========================= */}
          <div className="lg:col-span-8 space-y-6">

            <h1 className="text-2xl md:text-3xl font-extrabold mb-6 uppercase tracking-tight">
              Secure Checkout
            </h1>

            {/* =========================
                ADDRESS
                ========================= */}
            <section className="bg-white rounded-xl border border-[#e5e2e1] overflow-hidden shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setActiveStep(
                    activeStep === "address"
                      ? ""
                      : "address"
                  )
                }
                className="w-full flex items-center justify-between p-4 md:p-6 bg-[#fcf9f8] hover:bg-[#f0eded] transition-colors text-left"
              >

                <div className="flex items-center gap-4">

                  <span className="w-8 h-8 rounded-full bg-[#ad2d47] text-white flex items-center justify-center font-bold text-sm">
                    1
                  </span>

                  <div>

                    <h2 className="text-base md:text-lg font-bold">
                      Delivery Address
                    </h2>

                    <p className="text-xs md:text-sm text-[#5e5e5e]">
                      Confirm where you want your items delivered
                    </p>

                  </div>

                </div>

                <span className="material-symbols-outlined text-[#5e5e5e]">
                  {activeStep === "address"
                    ? "expand_less"
                    : "expand_more"}
                </span>

              </button>

              {activeStep === "address" && (
                <div>

                  <div className="p-4 md:p-6">

                    <div className="p-4 border-2 border-[#ad2d47] rounded-xl relative bg-[#ff6b81]/5 max-w-md">

                      <div className="absolute top-3 right-3 text-[#ad2d47]">
                        <span className="material-symbols-outlined filled">
                          check_circle
                        </span>
                      </div>

                      <span className="text-[10px] font-bold tracking-wider text-[#ad2d47] mb-1 block uppercase">
                        HOME
                      </span>

                      <p className="text-sm md:text-base font-bold text-[#1b1c1c]">
                        {user?.name ||
                          "Customer"}
                      </p>

                      <p className="text-xs md:text-sm text-[#5e5e5e] mt-1">
                        {user?.phone ||
                          "Phone number not added"}
                        {" | "}
                        {user?.email ||
                          "Email not available"}
                      </p>

                      <p className="text-xs md:text-sm text-[#5e5e5e] mt-2 leading-relaxed">
                        450 East 29th Street,
                        Apt 12B
                        <br />
                        New York, NY 10016
                      </p>

                    </div>

                  </div>

                  <div className="p-4 md:p-5 border-t border-[#e5e2e1] bg-[#fcf9f8]">

                    <button
                      type="button"
                      onClick={() =>
                        setActiveStep(
                          "payment"
                        )
                      }
                      className="w-full sm:w-auto px-6 py-3 bg-[#ad2d47] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#8c1231] transition-all shadow-sm"
                    >
                      Deliver to this address
                    </button>

                  </div>

                </div>
              )}

            </section>

            {/* =========================
                PAYMENT
                ========================= */}
            <section className="bg-white rounded-xl border border-[#e5e2e1] overflow-hidden shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setActiveStep(
                    activeStep === "payment"
                      ? ""
                      : "payment"
                  )
                }
                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-[#fcf9f8] transition-colors text-left"
              >

                <div className="flex items-center gap-4">

                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      activeStep ===
                        "payment"
                        ? "bg-[#ad2d47] text-white"
                        : "bg-[#e5e2e1] text-[#5e5e5e]"
                    }`}
                  >
                    2
                  </span>

                  <div>

                    <h2 className="text-base md:text-lg font-bold">
                      Payment Method
                    </h2>

                    <p className="text-xs md:text-sm text-[#5e5e5e]">
                      Choose how you want to pay
                    </p>

                  </div>

                </div>

                <span className="material-symbols-outlined text-[#5e5e5e]">
                  {activeStep === "payment"
                    ? "expand_less"
                    : "expand_more"}
                </span>

              </button>

              {activeStep === "payment" && (
                <div className="p-4 md:p-6 space-y-4">

                  {/* COD */}
                  <label className="flex items-center p-4 border-2 border-[#ad2d47] rounded-xl cursor-pointer bg-[#ff6b81]/5">

                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      defaultChecked
                      className="w-5 h-5 text-[#ad2d47] focus:ring-[#ad2d47]"
                    />

                    <span className="ml-3 flex items-center gap-3">

                      <span className="material-symbols-outlined text-[#5e5e5e] text-[20px]">
                        account_balance_wallet
                      </span>

                      <span className="text-xs md:text-sm font-bold">
                        Cash on Delivery (COD)
                      </span>

                    </span>

                  </label>

                  {/* CARD */}
                  <label className="flex items-center p-4 border border-[#dfbfc1] rounded-xl opacity-60">

                    <input
                      disabled
                      type="radio"
                      name="payment"
                      className="w-5 h-5"
                    />

                    <span className="ml-3 flex items-center gap-3">

                      <span className="material-symbols-outlined text-[#5e5e5e] text-[20px]">
                        credit_card
                      </span>

                      <span className="text-xs md:text-sm font-bold">
                        Credit/Debit Card (Soon)
                      </span>

                    </span>

                  </label>

                </div>
              )}

            </section>

          </div>

          {/* =========================
              ORDER SUMMARY
              ========================= */}
          <aside className="lg:col-span-4">

            <div className="sticky top-[100px] bg-white rounded-2xl border border-[#e5e2e1] shadow-sm overflow-hidden">

              {/* Header */}
              <div className="p-5 md:p-6 bg-[#fcf9f8] border-b border-[#e5e2e1]">

                <h3 className="text-base md:text-lg font-bold uppercase tracking-wider">
                  Order Summary
                </h3>

                <p className="text-xs md:text-sm text-[#5e5e5e] mt-1">
                  {totalItems} Items
                </p>

              </div>

              {/* Items */}
              <div className="p-5 md:p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar border-b border-[#e5e2e1]">

                {cart.map(
                  (item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-3 md:gap-4"
                    >

                      <div className="w-10 h-10 md:w-14 md:h-14 bg-[#f0eded] rounded-md border border-[#dfbfc1] overflow-hidden flex-shrink-0">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-bold text-[10px] md:text-[11px] truncate leading-tight">
                          {item.name}
                        </p>

                        <p className="text-[9px] md:text-[10px] text-[#5e5e5e] mt-1">
                          Qty: {item.qty}
                        </p>

                      </div>

                      <p className="font-bold text-xs md:text-sm">
                        $
                        {(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.qty || 0
                          )
                        ).toFixed(2)}
                      </p>

                    </div>
                  )
                )}

              </div>

              {/* Amount */}
              <div className="p-5 md:p-6 space-y-3 bg-[#fcf9f8]">

                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-[#5e5e5e]">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-[#5e5e5e]">
                    Delivery
                  </span>

                  <span className="font-bold text-[#ad2d47]">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-[#5e5e5e]">
                    Tax (5%)
                  </span>

                  <span className="font-bold">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 mt-2 border-t border-[#e5e2e1] text-base md:text-lg font-bold uppercase tracking-wider">

                  <span>
                    To Pay
                  </span>

                  <span className="text-[#ad2d47]">
                    ${total.toFixed(2)}
                  </span>

                </div>

              </div>

              {/* Place Order */}
              <div className="p-5 md:p-6 bg-white">

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={
                    orderLoading ||
                    cart.length === 0
                  }
                  className="w-full py-3 md:py-4 bg-[#ad2d47] text-white rounded-xl font-bold shadow-md hover:bg-[#8c1231] active:scale-95 transition-all text-sm md:text-base uppercase tracking-wider flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {orderLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        sync
                      </span>

                      Placing Order...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                        check_circle
                      </span>

                      Place Order
                    </>
                  )}

                </button>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default Checkout;