import { useEffect, useMemo, useState } from "react";

const PRODUCTS_PER_PAGE = 30;
const API_URL = "http://localhost:5000/api/products";

const TAG_OPTIONS = [
  "New Arrivals",
  "Best Sellers",
  "Trending",
  "Top Rated",
  "Deal of the Day",
  "Showcase",
];

const EMPTY_FORM = {
  id: "",
  name: "",
  category: "",
  subcategory: "",
  price: "",
  oldPrice: "",
  badge: "",
  image: "",
  hoverImage: "",
  rating: "",
  reviewCount: "",
  stock: "",
  sold: "",
  available: true,
  description: "",
  features: [],
  tags: [],
  colors: [],
  sizes: [],
};

function Products({ initialProducts = [], categories = [] }) {
  const [products, setProducts] = useState(initialProducts);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const categoryNames = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }, [categories]);

  // LOAD PRODUCTS FROM BACKEND
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load products:", error);
        alert("Failed to load products from backend.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        String(product.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.category || "")
          .toLowerCase()
          .includes(searchText) ||
        String(product.subcategory || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "all" ||
        String(product.category || "") ===
          String(categoryFilter);

      const isAvailable =
        product.available === true ||
        product.available === 1 ||
        product.available === "1" ||
        product.available === "true";

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && isAvailable) ||
        (availabilityFilter === "unavailable" && !isAvailable);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    availabilityFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PRODUCTS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, safeCurrentPage]);

  const totalAvailable = products.filter((product) => {
    return (
      product.available === true ||
      product.available === 1 ||
      product.available === "1" ||
      product.available === "true"
    );
  }).length;

  const totalUnavailable =
    products.length - totalAvailable;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (event) => {
    setAvailabilityFilter(event.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setForm({
      ...EMPTY_FORM,
      id: "",
      features: [],
      tags: [],
      colors: [],
      sizes: [],
    });

    setColorInput("");
    setSizeInput("");
    setFeatureInput("");

    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      ...EMPTY_FORM,
      ...product,

      features: Array.isArray(product.features)
        ? product.features
        : [],

      tags: Array.isArray(product.tags)
        ? product.tags
        : [],

      colors: Array.isArray(product.colors)
        ? product.colors
        : [],

      sizes: Array.isArray(product.sizes)
        ? product.sizes
        : [],
    });

    setColorInput("");
    setSizeInput("");
    setFeatureInput("");

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);

    setColorInput("");
    setSizeInput("");
    setFeatureInput("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  // ADD / UPDATE PRODUCT THROUGH BACKEND
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const productData = {
        ...form,

        id:
          form.id ||
          `p${Date.now()}`,

        price: Number(form.price) || 0,

        oldPrice:
          form.oldPrice === ""
            ? null
            : Number(form.oldPrice) || 0,

        rating: Number(form.rating) || 0,

        reviewCount:
          Number(form.reviewCount) || 0,

        stock: Number(form.stock) || 0,

        sold: Number(form.sold) || 0,

        /*
          Backend schema uses Number for available.
          Therefore:
          true  -> 1
          false -> 0
        */
        available: form.available ? 1 : 0,

        features: Array.isArray(form.features)
          ? form.features
          : [],

        tags: Array.isArray(form.tags)
          ? form.tags
          : [],

        colors: Array.isArray(form.colors)
          ? form.colors
          : [],

        sizes: Array.isArray(form.sizes)
          ? form.sizes
          : [],
      };

      // UPDATE
      if (editingProduct) {
        const response = await fetch(
          `${API_URL}/${editingProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}`,
            },
            body: JSON.stringify(productData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update product"
          );
        }

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingProduct.id
              ? data
              : product
          )
        );

        alert("Product updated successfully.");
      }

      // ADD
      else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("anon_token") || ""}`,
          },
          body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to create product"
          );
        }

        setProducts((previous) => [
          data,
          ...previous,
        ]);

        setCurrentPage(1);

        alert("Product added successfully.");
      }

      closeForm();
    } catch (error) {
      console.error(
        "Product save failed:",
        error
      );

      alert(
        error.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT THROUGH BACKEND
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product.id !== productId
        )
      );

      const newTotalPages = Math.max(
        1,
        Math.ceil(
          (filteredProducts.length - 1) /
            PRODUCTS_PER_PAGE
        )
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(
        "Product delete failed:",
        error
      );

      alert(
        error.message ||
          "Failed to delete product."
      );
    }
  };

  const toggleTag = (tag) => {
    setForm((previous) => {
      const exists =
        previous.tags.includes(tag);

      return {
        ...previous,

        tags: exists
          ? previous.tags.filter(
              (item) => item !== tag
            )
          : [...previous.tags, tag],
      };
    });
  };

  const addColor = () => {
    const value = colorInput.trim();

    if (!value) return;

    if (!form.colors.includes(value)) {
      setForm((previous) => ({
        ...previous,
        colors: [
          ...previous.colors,
          value,
        ],
      }));
    }

    setColorInput("");
  };

  const removeColor = (color) => {
    setForm((previous) => ({
      ...previous,

      colors: previous.colors.filter(
        (item) => item !== color
      ),
    }));
  };

  const addSize = () => {
    const value = sizeInput.trim();

    if (!value) return;

    if (!form.sizes.includes(value)) {
      setForm((previous) => ({
        ...previous,

        sizes: [
          ...previous.sizes,
          value,
        ],
      }));
    }

    setSizeInput("");
  };

  const removeSize = (size) => {
    setForm((previous) => ({
      ...previous,

      sizes: previous.sizes.filter(
        (item) => item !== size
      ),
    }));
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    setForm((previous) => ({
      ...previous,

      features: [
        ...previous.features,
        value,
      ],
    }));

    setFeatureInput("");
  };

  const removeFeature = (featureIndex) => {
    setForm((previous) => ({
      ...previous,

      features: previous.features.filter(
        (_, index) =>
          index !== featureIndex
      ),
    }));
  };

  const handleEnterAdd = (
    event,
    callback
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callback();
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categoryNames.find(
      (item) =>
        String(item.id) ===
        String(categoryId)
    );

    return (
      category?.name ||
      categoryId ||
      "-"
    );
  };

  const getAvailability = (product) => {
    return (
      product.available === true ||
      product.available === 1 ||
      product.available === "1" ||
      product.available === "true"
    );
  };

  const formatPrice = (price) => {
    const number =
      Number(price) || 0;

    return `₹${number.toLocaleString(
      "en-IN"
    )}`;
  };

  const firstItem =
    filteredProducts.length === 0
      ? 0
      : (safeCurrentPage - 1) *
          PRODUCTS_PER_PAGE +
        1;

  const lastItem = Math.min(
    safeCurrentPage *
      PRODUCTS_PER_PAGE,
    filteredProducts.length
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products, pricing,
            inventory and product information.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Showing
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {filteredProducts.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {totalAvailable}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Unavailable
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {totalUnavailable}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* SEARCH */}
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Search Product
            </label>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, ID, category..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-900"
            >
              <option value="all">
                All Categories
              </option>

              {categoryNames.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* AVAILABILITY */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Availability
            </label>

            <select
              value={availabilityFilter}
              onChange={
                handleAvailabilityChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-900"
            >
              <option value="all">
                All Products
              </option>

              <option value="available">
                Available
              </option>

              <option value="unavailable">
                Unavailable
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Rating
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(
                  (product) => {
                    const available =
                      getAvailability(product);

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* PRODUCT */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover"
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate text-sm font-semibold text-gray-900">
                                {product.name ||
                                  "Unnamed Product"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                ID:{" "}
                                {product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {getCategoryName(
                                product.category
                              )}
                            </p>

                            {product.subcategory && (
                              <p className="mt-1 text-xs text-gray-400">
                                {
                                  product.subcategory
                                }
                              </p>
                            )}
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(
                              product.price
                            )}
                          </p>

                          {Number(
                            product.oldPrice
                          ) >
                            Number(
                              product.price
                            ) && (
                            <p className="mt-1 text-xs text-gray-400 line-through">
                              {formatPrice(
                                product.oldPrice
                              )}
                            </p>
                          )}
                        </td>

                        {/* STOCK */}
                        <td className="px-5 py-4">
                          <p
                            className={`text-sm font-semibold ${
                              Number(
                                product.stock
                              ) <= 0
                                ? "text-red-600"
                                : Number(
                                      product.stock
                                    ) <= 5
                                ? "text-orange-600"
                                : "text-gray-800"
                            }`}
                          >
                            {product.stock ?? 0}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Sold:{" "}
                            {product.sold ??
                              0}
                          </p>
                        </td>

                        {/* RATING */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-800">
                            ⭐{" "}
                            {product.rating ??
                              0}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {product.reviewCount ??
                              0}{" "}
                            reviews
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          {available ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Unavailable
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  product
                                )
                              }
                              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {firstItem}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-800">
                {lastItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-end gap-1">
                <button
                  type="button"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    goToPage(
                      safeCurrentPage - 1
                    )
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      goToPage(page)
                    }
                    className={`min-w-9 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      page ===
                      safeCurrentPage
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    goToPage(
                      safeCurrentPage + 1
                    )
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Manage all product information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* BASIC INFORMATION */}
              <section>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Category
                    </label>

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    >
                      <option value="">
                        Select Category
                      </option>

                      {categoryNames.map(
                        (category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Subcategory
                    </label>

                    <input
                      name="subcategory"
                      value={
                        form.subcategory
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                      placeholder="Subcategory"
                    />
                  </div>
                </div>
              </section>

              {/* PRICING & INVENTORY */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Old Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="oldPrice"
                      value={form.oldPrice}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Stock
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Sold
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="sold"
                      value={form.sold}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Rating
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Review Count
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="reviewCount"
                      value={
                        form.reviewCount
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Badge
                    </label>

                    <input
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                      placeholder="Example: SALE, NEW, HOT"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <input
                        type="checkbox"
                        name="available"
                        checked={Boolean(
                          form.available
                        )}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-medium text-gray-700">
                        Product is Available
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* IMAGES */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Product Images
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Main Image
                    </label>

                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                      placeholder="/assets/products/1.jpg"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Hover Image
                    </label>

                    <input
                      name="hoverImage"
                      value={
                        form.hoverImage
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                      placeholder="/assets/products/1-hover.jpg"
                    />
                  </div>
                </div>

                {form.image && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-gray-500">
                      Image Preview
                    </p>

                    <div className="h-28 w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* COLORS */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Colors
                </h3>

                <div className="flex gap-2">
                  <input
                    value={colorInput}
                    onChange={(event) =>
                      setColorInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) =>
                      handleEnterAdd(
                        event,
                        addColor
                      )
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    placeholder="Example: Black"
                  />

                  <button
                    type="button"
                    onClick={addColor}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Add
                  </button>
                </div>

                {form.colors.length >
                  0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.colors.map(
                      (color) => (
                        <span
                          key={color}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                          {color}

                          <button
                            type="button"
                            onClick={() =>
                              removeColor(
                                color
                              )
                            }
                            className="text-gray-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* SIZES */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Sizes
                </h3>

                <div className="flex gap-2">
                  <input
                    value={sizeInput}
                    onChange={(event) =>
                      setSizeInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) =>
                      handleEnterAdd(
                        event,
                        addSize
                      )
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    placeholder="Example: M, L, XL"
                  />

                  <button
                    type="button"
                    onClick={addSize}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Add
                  </button>
                </div>

                {form.sizes.length >
                  0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.sizes.map(
                      (size) => (
                        <span
                          key={size}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                          {size}

                          <button
                            type="button"
                            onClick={() =>
                              removeSize(
                                size
                              )
                            }
                            className="text-gray-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* DESCRIPTION */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Description
                </h3>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  rows="5"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="Product description..."
                />
              </section>

              {/* FEATURES */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Features
                </h3>

                <div className="flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(event) =>
                      setFeatureInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) =>
                      handleEnterAdd(
                        event,
                        addFeature
                      )
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    placeholder="Add product feature"
                  />

                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Add
                  </button>
                </div>

                {form.features.length >
                  0 && (
                  <div className="mt-3 space-y-2">
                    {form.features.map(
                      (
                        feature,
                        index
                      ) => (
                        <div
                          key={`${feature}-${index}`}
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                        >
                          <span className="text-sm text-gray-700">
                            •{" "}
                            {feature}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeFeature(
                                index
                              )
                            }
                            className="text-xs font-semibold text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* TAGS */}
              <section className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-800">
                  Product Tags
                </h3>

                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(
                    (tag) => {
                      const selected =
                        form.tags.includes(
                          tag
                        );

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            toggleTag(tag)
                          }
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                            selected
                              ? "bg-gray-900 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    }
                  )}
                </div>
              </section>

              {/* FORM ACTIONS */}
              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;