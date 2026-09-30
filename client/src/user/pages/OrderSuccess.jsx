
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

function OrderSuccess() {
  const [searchParams] =
    useSearchParams();

  const [order, setOrder] =
    useState(null);

  useEffect(() => {
    try {
      const savedOrder =
        JSON.parse(
          localStorage.getItem(
            "anon_last_order"
          ) || "null"
        );

      setOrder(savedOrder);
    } catch (error) {
      console.error(
        "Order loading error:",
        error
      );

      setOrder(null);
    }
  }, []);

  const orderId =
    searchParams.get("order") ||
    order?.order_id ||
    "Order Confirmed";

  return (
    <main className="grow flex items-center justify-center px-5 py-12 md:py-20">

      <div className="w-full max-w-[650px]">

        <div className="bg-white rounded-2xl border border-[#e5e2e1] shadow-sm overflow-hidden">

          {/* Success Header */}

          <div className="px-6 py-10 md:px-10 md:py-12 text-center bg-[#fcf9f8]">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">

              <span className="material-symbols-outlined text-[46px]">
                check_circle
              </span>

            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold mt-6">
              Order Placed Successfully!
            </h1>

            <p className="text-sm md:text-base text-[#5e5e5e] mt-3">
              Thank you for your purchase.
              Your order has been placed
              successfully.
            </p>

          </div>


          {/* Order Details */}

          <div className="p-6 md:p-10">

            <div className="rounded-xl border border-[#e5e2e1] p-5 bg-white">

              <div className="flex justify-between items-center gap-4">

                <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                  Order ID
                </span>

                <span className="font-extrabold text-[#ad2d47]">
                  {orderId}
                </span>

              </div>


              {order && (
                <>

                  <div className="border-t border-[#e5e2e1] my-4" />

                  <div className="flex justify-between items-center">

                    <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                      Items
                    </span>

                    <span className="font-bold">
                      {order.total_items ||
                        order.items?.reduce(
                          (sum, item) =>
                            sum +
                            Number(
                              item.qty || 0
                            ),
                          0
                        ) ||
                        0}
                    </span>

                  </div>


                  <div className="border-t border-[#e5e2e1] my-4" />


                  <div className="flex justify-between items-center">

                    <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                      Payment
                    </span>

                    <span className="font-bold">
                      {order.payment_method ||
                        "Cash on Delivery"}
                    </span>

                  </div>


                  <div className="border-t border-[#e5e2e1] my-4" />


                  <div className="flex justify-between items-center">

                    <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                      Total
                    </span>

                    <span className="font-extrabold text-lg text-[#ad2d47]">
                      $
                      {Number(
                        order.total || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                </>
              )}

            </div>


            {/* Message */}

            <div className="mt-6 p-4 rounded-xl bg-[#fcf9f8] border border-[#e5e2e1]">

              <div className="flex gap-3">

                <span className="material-symbols-outlined text-[#ad2d47]">
                  local_shipping
                </span>

                <div>

                  <p className="font-bold text-sm">
                    Your order is being processed
                  </p>

                  <p className="text-xs text-[#5e5e5e] mt-1 leading-relaxed">
                    We will prepare your
                    items and arrange
                    delivery to your
                    address.
                  </p>

                </div>

              </div>

            </div>


            {/* Buttons */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

              <Link
                to="/"
                className="py-3 px-5 rounded-xl border border-[#ad2d47] text-[#ad2d47] font-bold text-sm text-center hover:bg-[#ad2d47]/5 transition-all"
              >
                Continue Shopping
              </Link>

              <Link
                to="/catalog"
                className="py-3 px-5 rounded-xl bg-[#ad2d47] text-white font-bold text-sm text-center hover:bg-[#8c1231] transition-all"
              >
                Browse Products
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;
