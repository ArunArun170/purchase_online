import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortValue, setSortValue] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  // =========================
  // LOAD DATABASE DATA
  // =========================
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        // Load categories from MongoDB API
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/categories"
        );

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const loadedCategories = await categoriesResponse.json();

        if (!Array.isArray(loadedCategories)) {
          throw new Error("Invalid categories API response");
        }

        // Normalize category values
        loadedCategories.forEach((category) => {
          if (category.show_in_sidebar === undefined) {
            category.show_in_sidebar = true;
          }
          if (category.subcategories) {
            category.subcategories = category.subcategories.map(
              (subcategory) => typeof subcategory === "string"
                ? { name: subcategory, show_in_sidebar: true }
                : subcategory
            );
          }
        });

        setCategories(loadedCategories);

        // =========================
        // LOAD PRODUCTS FROM BACKEND
        // =========================
        const productsResponse =
          await fetch(
            "http://localhost:5000/api/products"
          );

        if (!productsResponse.ok) {
          throw new Error(
            `Products API HTTP Error: ${productsResponse.status}`
          );
        }

        const productsData =
          await productsResponse.json();

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );
      } catch (error) {
        console.error(
          "Catalog data loading error:",
          error
        );
      }
    };

    loadDatabase();
  }, []);

  // =========================
  // READ URL FILTERS
  // =========================
  useEffect(() => {
    const category =
      searchParams.get("category");

    if (category) {
      setSelectedCategories([
        category,
      ]);
    } else {
      setSelectedCategories([]);
    }

    setCurrentPage(1);
  }, [searchParams]);

  const searchQuery =
    searchParams.get("search") || "";

  const selectedSubcategory =
    searchParams.get("subcategory") || "";

  const selectedTag =
    searchParams.get("tag") || "";

  // =========================
  // TOGGLE CATEGORY
  // =========================
  const toggleCategory = (
    categoryId
  ) => {
    let updatedCategories = [
      ...selectedCategories,
    ];

    if (
      updatedCategories.includes(
        categoryId
      )
    ) {
      updatedCategories =
        updatedCategories.filter(
          (id) => id !== categoryId
        );
    } else {
      updatedCategories.push(
        categoryId
      );
    }

    setSelectedCategories(
      updatedCategories
    );

    setCurrentPage(1);

    const params = new URLSearchParams(
      searchParams
    );

    params.delete("category");
    params.delete("subcategory");

    if (
      updatedCategories.length > 0
    ) {
      params.set(
        "category",
        updatedCategories[0]
      );
    }

    setSearchParams(params);
  };

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    const params =
      new URLSearchParams();

    if (searchQuery) {
      params.set(
        "search",
        searchQuery
      );
    }

    setSelectedCategories([]);
    setCurrentPage(1);
    setSearchParams(params);
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts =
    useMemo(() => {
      let results = [...products];

      // Category
      if (
        selectedCategories.length > 0
      ) {
        results = results.filter(
          (product) =>
            selectedCategories.includes(
              product.category
            )
        );
      }

      // Search
      if (searchQuery.trim()) {
        const query =
          searchQuery
            .trim()
            .toLowerCase();

        results = results.filter(
          (product) =>
            String(
              product.name || ""
            )
              .toLowerCase()
              .includes(query)
        );
      }

      // Subcategory
      if (selectedSubcategory) {
        results = results.filter(
          (product) =>
            String(
              product.subcategory || ""
            ).toLowerCase() ===
            selectedSubcategory.toLowerCase()
        );
      }

      // Tag
      if (selectedTag) {
        results = results.filter(
          (product) =>
            Array.isArray(
              product.tags
            ) &&
            product.tags.includes(
              selectedTag
            )
        );
      }

      // Sorting
      if (
        sortValue === "price-low"
      ) {
        results.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );
      } else if (
        sortValue === "price-high"
      ) {
        results.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );
      } else {
        // Preserve database order and show newest first
        results.reverse();
      }

      return results;
    }, [
      products,
      selectedCategories,
      searchQuery,
      selectedSubcategory,
      selectedTag,
      sortValue,
    ]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const safeCurrentPage =
    totalPages > 0
      ? Math.min(
          currentPage,
          totalPages
        )
      : 1;

  const startIndex =
    (safeCurrentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex +
        productsPerPage
    );

  // Maximum 5 page buttons
  const pageWindowStart =
    Math.min(
      Math.max(
        safeCurrentPage - 2,
        1
      ),
      Math.max(
        totalPages - 4,
        1
      )
    );

  const pageNumbers =
    Array.from(
      {
        length: Math.min(
          totalPages,
          5
        ),
      },
      (_, index) =>
        pageWindowStart + index
    );

  // =========================
  // PAGE CHANGE
  // =========================
  const changePage = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="grow">

      {/* =========================
          CATALOG CONTAINER
          ========================= */}
      <section className="max-w-[1200px] mx-auto px-5 py-6 md:py-10">

        {/* =========================
            HEADER
            ========================= */}
        <div className="mb-6 md:mb-8 border-b border-[#e5e2e1] pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">

          <div>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
              {searchQuery
                ? `Search: ${searchQuery}`
                : selectedTag ===
                  "deal-of-the-day"
                ? "Hot Deals"
                : "All Collections Catalog"}
            </h1>

            <p className="text-sm text-[#5e5e5e] mt-2">
              Showing{" "}
              {filteredProducts.length}{" "}
              results
            </p>
          </div>

          {/* SORT */}
          <div className="flex items-center justify-between sm:justify-end gap-3">

            <label className="text-xs font-bold text-[#5e5e5e] uppercase">
              Sort
            </label>

            <select
              value={sortValue}
              onChange={(event) => {
                setSortValue(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              className="border border-[#dfbfc1] bg-white rounded-lg text-xs p-2 outline-none sm:w-auto"
            >
              <option value="newest">
                Newest Arrivals
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>
            </select>

          </div>

        </div>

        {/* =========================
            CONTENT
            ========================= */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

          {/* =========================
              FILTER SIDEBAR
              ========================= */}
          <aside className="w-full lg:w-72 flex-shrink-0">

            <section className="bg-white rounded-xl border border-[#dfbfc1] p-5 shadow-sm">

              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-2 mb-4">

                <h3 className="font-bold text-sm tracking-wide uppercase">
                  Categories
                </h3>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="text-xs font-bold text-[#ad2d47] hover:underline"
                >
                  Clear
                </button>

              </div>

              <ul className="space-y-3 text-xs font-semibold text-[#5e5e5e]">

                {categories
                  .filter(
                    (category) =>
                      category.show_in_sidebar !==
                      false
                  )
                  .map(
                    (category) => (
                      <li
                        key={
                          category.id
                        }
                      >

                        <label className="flex items-center gap-3 cursor-pointer group">

                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(
                              category.id
                            )}
                            onChange={() =>
                              toggleCategory(
                                category.id
                              )
                            }
                            className="w-4 h-4 rounded border-[#dfbfc1] text-[#ad2d47] focus:ring-[#ad2d47]"
                          />

                          <span className="text-xs font-bold uppercase group-hover:text-[#ad2d47] transition-colors">
                            {
                              category.name
                            }
                          </span>

                        </label>

                      </li>
                    )
                  )}

              </ul>

            </section>

          </aside>

          {/* =========================
              PRODUCTS
              ========================= */}
          <div className="flex-1 space-y-8">

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">

              {currentProducts.length >
              0 ? (
                currentProducts.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                    />
                  )
                )
              ) : (
                <div className="col-span-full py-16 text-center border border-dashed border-[#dfbfc1] rounded-xl bg-[#fcf9f8]">

                  <span className="material-symbols-outlined text-[48px] text-[#dfbfc1]">
                    inbox
                  </span>

                  <p className="font-bold text-sm text-[#5e5e5e] mt-3">
                    No products
                    found.
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="mt-4 text-xs font-bold text-[#ad2d47] hover:underline"
                  >
                    Clear filters
                  </button>

                </div>
              )}

            </div>

            {/* =========================
                PAGINATION
                MAXIMUM 5 BUTTONS
                ========================= */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-[#e5e2e1]">

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    1
                  }
                  onClick={() =>
                    changePage(
                      Math.max(
                        1,
                        safeCurrentPage -
                          1
                      )
                    )
                  }
                  className="h-9 px-3 rounded-lg border border-[#dfbfc1] bg-white text-xs font-bold text-[#5e5e5e] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#ad2d47] hover:text-[#ad2d47]"
                >
                  Previous
                </button>

                {pageNumbers.map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        changePage(
                          page
                        )
                      }
                      className={`w-9 h-9 rounded-lg border font-bold text-xs shadow-sm transition-colors ${
                        page ===
                        safeCurrentPage
                          ? "bg-[#ad2d47] text-white border-[#ad2d47]"
                          : "bg-white border-[#dfbfc1] text-[#5e5e5e] hover:text-[#ad2d47] hover:border-[#ad2d47]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    changePage(
                      Math.min(
                        totalPages,
                        safeCurrentPage +
                          1
                      )
                    )
                  }
                  className="h-9 px-3 rounded-lg border border-[#dfbfc1] bg-white text-xs font-bold text-[#5e5e5e] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#ad2d47] hover:text-[#ad2d47]"
                >
                  Next
                </button>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default Catalog;