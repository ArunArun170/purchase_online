import { useEffect, useMemo, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAll, setShowAll] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [deleteOrder, setDeleteOrder] =
    useState(null);

  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response =
          await fetch("https://purchase-online.onrender.com/api/orders", { headers: { Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}` } });

        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        const data =
          await response.json();

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {
        console.error(
          "Orders loading error:",
          error
        );

        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  /* =========================
     HELPERS
     ========================= */

  const getOrderId = (order) => {
    return (
      order.id ||
      order.order_id ||
      order.orderId ||
      "N/A"
    );
  };

  const getCustomerName = (order) => {
    return (
      order.customer_name ||
      order.customer?.name ||
      order.name ||
      order.customerName ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return (
      order.customer_email ||
      order.customer?.email ||
      order.email ||
      ""
    );
  };

  const getStatus = (order) => {
    return (
      order.status ||
      order.order_status ||
      "Processing"
    );
  };

  const getOrderDate = (order) => {
    return (
      order.date ||
      order.created_at ||
      order.createdAt ||
      "—"
    );
  };

  const getOrderTotal = (order) => {
    return Number(
      order.total_price ??
        order.total ??
        order.total_amount ??
        order.amount ??
        0
    );
  };

  /* =========================
     FILTER ORDERS
     ========================= */

  const filteredOrders = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return orders.filter(
      (order) => {
        const orderId =
          String(
            getOrderId(order)
          ).toLowerCase();

        const customer =
          String(
            getCustomerName(order)
          ).toLowerCase();

        const email =
          String(
            getCustomerEmail(order)
          ).toLowerCase();

        const status =
          String(
            getStatus(order)
          ).toLowerCase();

        const matchesSearch =
          !search ||
          orderId.includes(search) ||
          customer.includes(search) ||
          email.includes(search);

        const matchesStatus =
          statusFilter === "all" ||
          status ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    orders,
    searchTerm,
    statusFilter,
  ]);

  /* =========================
     RECENT / ALL ORDERS
     ========================= */

  const displayedOrders = showAll
    ? filteredOrders
    : filteredOrders.slice(0, 15);

  /* =========================
     PAGINATION
     ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedOrders = showAll
    ? filteredOrders.slice(
        (currentPage - 1) *
          ITEMS_PER_PAGE,
        currentPage *
          ITEMS_PER_PAGE
      )
    : displayedOrders;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =========================
     SUMMARY
     ========================= */

  const totalOrderValue = useMemo(() => {
    return orders.reduce(
      (total, order) =>
        total +
        getOrderTotal(order),
      0
    );
  }, [orders]);

  const statusOptions = useMemo(() => {
    const statuses = orders.map(
      (order) =>
        getStatus(order)
    );

    return [
      ...new Set(statuses),
    ];
  }, [orders]);

  /* =========================
     DELETE ORDER
     ========================= */

  const handleDeleteOrder = () => {
    if (!deleteOrder) {
      return;
    }

    const deleteId =
      getOrderId(deleteOrder);

    const deleteOrderFromDatabase = async () => {
      try {
        const response = await fetch(
          `https://purchase-online.onrender.com/api/orders/${encodeURIComponent(deleteId)}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}` } }
        );

        if (!response.ok) {
          throw new Error("Failed to delete order");
        }

        setOrders((previousOrders) =>
          previousOrders.filter(
            (order) =>
              getOrderId(order) !==
              deleteId
          )
        );
      } catch (error) {
        console.error("Order deletion error:", error);
      } finally {
        setDeleteOrder(null);
      }
    };

    deleteOrderFromDatabase();
  };

  /* =========================
     PAGE CHANGE
     ========================= */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     SEARCH / FILTER CHANGE
     ========================= */

  const handleSearchChange = (
    value
  ) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (
    value
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  /* =========================
     LOADING
     ========================= */

  if (loading) {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-xl min-h-[400px] flex items-center justify-center">

        <div className="flex items-center gap-3 text-[#ad2d47]">

          <span className="material-symbols-outlined animate-spin text-[28px]">
            sync
          </span>

          <span className="font-bold">
            Loading Orders...
          </span>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          SUMMARY
          ========================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

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
            Showing
          </p>

          <p className="text-2xl font-extrabold mt-2">
            {filteredOrders.length}
          </p>

        </div>


        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
            Total Order Value
          </p>

          <p className="text-2xl font-extrabold mt-2">
            ₹
            {totalOrderValue.toFixed(
              2
            )}
          </p>

        </div>

      </div>


      {/* =========================
          ORDER MANAGEMENT CARD
          ========================= */}

      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">

        {/* HEADER */}

        <div className="px-5 md:px-6 py-5 border-b border-[#e5e7eb]">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h3 className="text-lg font-bold">
                Order Management
              </h3>

              <p className="text-xs text-[#6b7280] mt-1">

                {showAll
                  ? `Showing ${filteredOrders.length} orders`
                  : "Showing latest 15 orders"}

              </p>

            </div>


            <button
              type="button"
              onClick={() => {
                setShowAll(
                  (previous) =>
                    !previous
                );
                setCurrentPage(1);
              }}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ad2d47] text-white text-sm font-bold hover:bg-[#96253d] transition-all"
            >

              <span className="material-symbols-outlined text-[19px]">
                {showAll
                  ? "keyboard_backspace"
                  : "list_alt"}
              </span>

              {showAll
                ? "Back to Recent"
                : "View All"}

            </button>

          </div>

        </div>


        {/* =========================
            FILTERS
            ========================= */}

        <div className="p-5 md:p-6 bg-[#fafafa] border-b border-[#e5e7eb]">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">

            {/* SEARCH */}

            <div className="relative">

              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b9096] text-[20px]">
                search
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value
                  )
                }
                placeholder="Search by order ID, customer or email..."
                className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-[#dfe2e5] bg-white text-sm outline-none focus:border-[#ad2d47] focus:ring-1 focus:ring-[#ad2d47]/20"
              />

            </div>


            {/* STATUS FILTER */}

            <div className="relative">

              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b9096] text-[20px]">
                filter_list
              </span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value
                  )
                }
                className="w-full h-[44px] pl-10 pr-9 rounded-lg border border-[#dfe2e5] bg-white text-sm outline-none focus:border-[#ad2d47] appearance-none cursor-pointer"
              >

                <option value="all">
                  All Status
                </option>

                {statusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}

              </select>

              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#777b80] text-[19px]">
                expand_more
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            ORDER COUNT
            ========================= */}

        <div className="px-5 md:px-6 py-3 border-b border-[#e5e7eb] flex items-center justify-between">

          <p className="text-xs text-[#6b7280]">

            {showAll
              ? `Page ${currentPage} of ${totalPages}`
              : `${paginatedOrders.length} recent orders`}

          </p>

          {showAll && (
            <p className="text-xs font-bold text-[#ad2d47]">
              30 per page
            </p>
          )}

        </div>


        {/* =========================
            TABLE
            ========================= */}

        {paginatedOrders.length ===
        0 ? (

          <div className="py-16 text-center">

            <span className="material-symbols-outlined text-[50px] text-[#c5c8cc]">
              shopping_cart
            </span>

            <p className="mt-3 font-bold text-[#555]">
              No orders found
            </p>

            <p className="text-xs text-[#888] mt-1">
              Try changing your search or filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm min-w-[850px]">

              <thead className="bg-[#f8f9fa]">

                <tr>

                  <th className="text-left px-5 py-4 font-bold">
                    Order ID
                  </th>

                  <th className="text-left px-5 py-4 font-bold">
                    Customer
                  </th>

                  <th className="text-left px-5 py-4 font-bold">
                    Date
                  </th>

                  <th className="text-left px-5 py-4 font-bold">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 font-bold">
                    Total
                  </th>

                  <th className="text-center px-5 py-4 font-bold">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {paginatedOrders.map(
                  (
                    order,
                    index
                  ) => {

                    const status =
                      getStatus(
                        order
                      );

                    return (
                      <tr
                        key={`${getOrderId(order)}-${index}`}
                        className="border-t border-[#f0f1f2] hover:bg-[#fcfcfc]"
                      >

                        {/* ORDER ID */}

                        <td className="px-5 py-4 font-bold text-[#25282c]">
                          {getOrderId(
                            order
                          )}
                        </td>


                        {/* CUSTOMER */}

                        <td className="px-5 py-4">

                          <div className="font-bold">
                            {getCustomerName(
                              order
                            )}
                          </div>

                          <div className="text-xs text-[#6b7280] mt-1">
                            {getCustomerEmail(
                              order
                            )}
                          </div>

                        </td>


                        {/* DATE */}

                        <td className="px-5 py-4 text-[#555b61]">
                          {getOrderDate(
                            order
                          )}
                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f3f4f6] text-xs font-bold text-[#555b61]">
                            {status}
                          </span>

                        </td>


                        {/* TOTAL */}

                        <td className="px-5 py-4 text-right font-bold">
                          ₹
                          {getOrderTotal(
                            order
                          ).toFixed(
                            2
                          )}
                        </td>


                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-center gap-2">

                            {/* VIEW */}

                            <button
                              type="button"
                              title="View Order"
                              onClick={() =>
                                setSelectedOrder(
                                  order
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e0e2e5] text-[#555b61] hover:bg-[#f5f5f5] hover:text-[#ad2d47]"
                            >

                              <span className="material-symbols-outlined text-[19px]">
                                visibility
                              </span>

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              title="Delete Order"
                              onClick={() =>
                                setDeleteOrder(
                                  order
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#ead7db] text-[#b13a52] hover:bg-[#fff1f3]"
                            >

                              <span className="material-symbols-outlined text-[19px]">
                                delete
                              </span>

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}


        {/* =========================
            PAGINATION
            ========================= */}

        {showAll &&
          totalPages > 1 && (

            <div className="px-5 md:px-6 py-5 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">

              <p className="text-xs text-[#6b7280]">

                Showing{" "}

                <span className="font-bold text-[#333]">
                  {(currentPage - 1) *
                    ITEMS_PER_PAGE +
                    1}
                </span>

                {" "}to{" "}

                <span className="font-bold text-[#333]">
                  {Math.min(
                    currentPage *
                      ITEMS_PER_PAGE,
                    filteredOrders.length
                  )}
                </span>

                {" "}of{" "}

                <span className="font-bold text-[#333]">
                  {filteredOrders.length}
                </span>

                {" "}orders

              </p>


              <div className="flex items-center gap-1">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e0e2e5] text-[#555b61] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f5]"
                >

                  <span className="material-symbols-outlined text-[19px]">
                    chevron_left
                  </span>

                </button>


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (page) => {

                    const showPage =
                      page === 1 ||
                      page ===
                        totalPages ||
                      Math.abs(
                        page -
                          currentPage
                      ) <= 1;

                    const previousPage =
                      page - 1;

                    const previousVisible =
                      previousPage === 1 ||
                      previousPage ===
                        totalPages ||
                      Math.abs(
                        previousPage -
                          currentPage
                      ) <= 1;

                    if (
                      !showPage
                    ) {
                      if (
                        previousVisible
                      ) {
                        return (
                          <span
                            key={`dots-${page}`}
                            className="w-9 h-9 flex items-center justify-center text-[#8b9096]"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    }

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            page
                          )
                        }
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          currentPage ===
                          page
                            ? "bg-[#ad2d47] text-white"
                            : "border border-[#e0e2e5] text-[#555b61] hover:bg-[#f5f5f5]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}


                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e0e2e5] text-[#555b61] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f5]"
                >

                  <span className="material-symbols-outlined text-[19px]">
                    chevron_right
                  </span>

                </button>

              </div>

            </div>

          )}

      </div>


      {/* =========================
          VIEW ORDER MODAL
          ========================= */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(
              null
            )
          }
        >

          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b border-[#e5e7eb] flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold">
                  Order Details
                </h3>

                <p className="text-xs text-[#6b7280] mt-1">
                  Order ID:{" "}
                  <span className="font-bold">
                    {getOrderId(
                      selectedOrder
                    )}
                  </span>
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#f5f5f5]"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="p-6 space-y-6">

              {/* CUSTOMER INFO */}

              <div>

                <h4 className="font-bold mb-3">
                  Customer Information
                </h4>

                <div className="bg-[#f8f9fa] rounded-lg p-4 space-y-2">

                  <div className="flex justify-between gap-4">

                    <span className="text-sm text-[#6b7280]">
                      Name
                    </span>

                    <span className="text-sm font-bold text-right">
                      {getCustomerName(
                        selectedOrder
                      )}
                    </span>

                  </div>


                  <div className="flex justify-between gap-4">

                    <span className="text-sm text-[#6b7280]">
                      Email
                    </span>

                    <span className="text-sm font-bold text-right break-all">
                      {getCustomerEmail(
                        selectedOrder
                      ) || "—"}
                    </span>

                  </div>

                </div>

              </div>


              {/* ORDER INFO */}

              <div>

                <h4 className="font-bold mb-3">
                  Order Information
                </h4>

                <div className="bg-[#f8f9fa] rounded-lg p-4 space-y-2">

                  <div className="flex justify-between gap-4">

                    <span className="text-sm text-[#6b7280]">
                      Order ID
                    </span>

                    <span className="text-sm font-bold">
                      {getOrderId(
                        selectedOrder
                      )}
                    </span>

                  </div>


                  <div className="flex justify-between gap-4">

                    <span className="text-sm text-[#6b7280]">
                      Date
                    </span>

                    <span className="text-sm font-bold">
                      {getOrderDate(
                        selectedOrder
                      )}
                    </span>

                  </div>


                  <div className="flex justify-between gap-4">

                    <span className="text-sm text-[#6b7280]">
                      Status
                    </span>

                    <span className="text-sm font-bold">
                      {getStatus(
                        selectedOrder
                      )}
                    </span>

                  </div>

                </div>

              </div>


              {/* PRODUCTS */}

              <div>

                <h4 className="font-bold mb-3">
                  Ordered Products
                </h4>

                {Array.isArray(
                  selectedOrder.items
                ) &&
                selectedOrder.items
                  .length > 0 ? (

                  <div className="space-y-2">

                    {selectedOrder.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 border border-[#e5e7eb] rounded-lg p-3"
                        >

                          <div>

                            <p className="font-bold text-sm">
                              {item.name ||
                                item.product_name ||
                                "Product"}
                            </p>

                            <p className="text-xs text-[#6b7280] mt-1">
                              Qty:{" "}
                              {item.quantity ||
                                item.qty ||
                                1}
                            </p>

                          </div>


                          <p className="font-bold text-sm">
                            ₹
                            {Number(
                              item.price ||
                                item.total ||
                                0
                            ).toFixed(
                              2
                            )}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="bg-[#f8f9fa] rounded-lg p-4 text-sm text-[#6b7280]">
                    Product details are not available in this order.
                  </div>

                )}

              </div>


              {/* TOTAL */}

              <div className="border-t border-[#e5e7eb] pt-5 flex items-center justify-between">

                <span className="font-bold">
                  Order Total
                </span>

                <span className="text-xl font-extrabold text-[#ad2d47]">
                  ₹
                  {getOrderTotal(
                    selectedOrder
                  ).toFixed(
                    2
                  )}
                </span>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                className="px-5 py-2.5 rounded-lg bg-[#ad2d47] text-white text-sm font-bold hover:bg-[#96253d]"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          DELETE CONFIRMATION
          ========================= */}

      {deleteOrder && (

        <div
          className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setDeleteOrder(null)
          }
        >

          <div
            className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="w-12 h-12 rounded-full bg-[#fff1f3] flex items-center justify-center">

              <span className="material-symbols-outlined text-[#b13a52] text-[25px]">
                delete
              </span>

            </div>


            <h3 className="text-lg font-bold mt-4">
              Delete Order?
            </h3>


            <p className="text-sm text-[#6b7280] mt-2 leading-6">
              Are you sure you want to delete order{" "}
              <span className="font-bold text-[#333]">
                {getOrderId(
                  deleteOrder
                )}
              </span>
              ? This action cannot be undone.
            </p>


            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setDeleteOrder(
                    null
                  )
                }
                className="px-4 py-2.5 rounded-lg border border-[#dfe2e5] text-sm font-bold text-[#555b61] hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleDeleteOrder
                }
                className="px-4 py-2.5 rounded-lg bg-[#b13a52] text-white text-sm font-bold hover:bg-[#96253d]"
              >
                Delete Order
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Orders;