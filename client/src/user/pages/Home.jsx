import { useEffect, useState } from "react";

import HeroSlider from "../components/HeroSlider";
import CategorySection from "../components/CategorySection";
import CategorySidebar from "../components/CategorySidebar";
import ProductMiniCard from "../components/ProductMiniCard";
import DealOfTheDay from "../components/DealOfTheDay";
import ProductCard from "../components/ProductCard";
import MarketingAds from "../components/MarketingAds";

function Home() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [ads, setAds] = useState(null);

  const [homeProductsPage, setHomeProductsPage] = useState(1);

  // =========================
  // LOAD DATABASE DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories and hero slides from MongoDB APIs
        const [categoriesResponse, heroResponse] = await Promise.all([
          fetch("http://localhost:5000/api/categories"),
          fetch("http://localhost:5000/api/hero-slides"),
        ]);

        if (!categoriesResponse.ok || !heroResponse.ok) {
          throw new Error("Failed to load categories or hero slides");
        }

        const categoriesData = await categoriesResponse.json();
        const heroData = await heroResponse.json();

        setHeroSlides(Array.isArray(heroData) ? heroData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // =========================
        // LOAD PRODUCTS FROM BACKEND
        // =========================
        const productsResponse = await fetch(
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

        // =========================
        // LOAD ADS FROM MONGODB API
        // =========================
        const adsResponse = await fetch(
          "http://localhost:5000/api/ads"
        );

        if (!adsResponse.ok) {
          throw new Error(
            `Ads API HTTP Error: ${adsResponse.status}`
          );
        }

        const adsData = await adsResponse.json();
        setAds(adsData);
      } catch (error) {
        console.error(
          "Home data loading error:",
          error
        );
      }
    };

    loadData();
  }, []);

  // =========================
  // NORMALIZE CATEGORIES
  // =========================
  useEffect(() => {
    setCategories((currentCategories) => {
      return currentCategories.map(
        (category) => {
          const updatedCategory = {
            ...category,
          };

          if (
            updatedCategory.show_in_scrollbar ===
            undefined
          ) {
            updatedCategory.show_in_scrollbar =
              true;
          }

          if (
            updatedCategory.show_in_sidebar ===
            undefined
          ) {
            updatedCategory.show_in_sidebar =
              true;
          }

          if (
            Array.isArray(
              updatedCategory.subcategories
            )
          ) {
            updatedCategory.subcategories =
              updatedCategory.subcategories.map(
                (subcategory) =>
                  typeof subcategory ===
                  "string"
                    ? {
                        name: subcategory,
                        show_in_sidebar: true,
                      }
                    : subcategory
              );
          }

          return updatedCategory;
        }
      );
    });
  }, []);

  // =========================
  // NEW ARRIVALS
  // =========================
  const newArrivals = products
    .filter(
      (product) =>
        product.tags &&
        product.tags.includes(
          "new-arrivals"
        )
    )
    .slice(0, 3);

  // =========================
  // TRENDING
  // =========================
  const trending = products
    .filter(
      (product) =>
        product.tags &&
        product.tags.includes(
          "trending"
        )
    )
    .slice(0, 3);

  // =========================
  // TOP RATED
  // =========================
  const topRated = products
    .filter(
      (product) =>
        product.tags &&
        product.tags.includes(
          "top-rated"
        )
    )
    .slice(0, 3);

  // =========================
  // DEAL OF THE DAY
  // =========================
  const dealOfTheDay = products.find(
    (product) =>
      product.tags &&
      product.tags.includes(
        "deal-of-the-day"
      )
  );

  // =========================
  // NEW PRODUCTS SHOWCASE
  // =========================
  const newProducts = products.filter(
    (product) =>
      product.tags &&
      product.tags.includes(
        "new-products"
      )
  );

  // 6 products per page
  const productsPerPage = 6;

  const totalProductPages = Math.ceil(
    newProducts.length /
      productsPerPage
  );

  const startProductIndex =
    (homeProductsPage - 1) *
    productsPerPage;

  const currentProducts =
    newProducts.slice(
      startProductIndex,
      startProductIndex +
        productsPerPage
    );

  // Maximum 5 page buttons
  const visiblePageNumbers =
    Array.from(
      {
        length: Math.min(
          totalProductPages,
          5
        ),
      },
      (_, index) => index + 1
    );

  // =========================
  // PAGE CHANGE
  // =========================
  const changeHomeProductsPage = (
    page
  ) => {
    setHomeProductsPage(page);

    window.scrollTo({
      top:
        document.body.scrollHeight *
        0.55,
      behavior: "smooth",
    });
  };

  return (
    <main className="grow">

      {/* =========================
          HERO SLIDER
          ========================= */}
      <HeroSlider
        slides={heroSlides}
      />

      {/* =========================
          HORIZONTAL CATEGORIES
          ========================= */}
      <CategorySection
        categories={categories}
      />

      {/* =========================
          MAIN HOME CONTENT
          ========================= */}
      <section className="max-w-[1200px] mx-auto px-5 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* =========================
              CATEGORY SIDEBAR
              ========================= */}
          <CategorySidebar
            categories={categories}
          />

          {/* =========================
              RIGHT CONTENT
              ========================= */}
          <div className="lg:col-span-3 space-y-12">

            {/* =========================
                NEW ARRIVALS / TRENDING / TOP RATED
                ========================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* NEW ARRIVALS */}
              <div className="space-y-4">

                <h3 className="text-sm font-extrabold uppercase border-b border-[#e5e2e1] pb-2">
                  New Arrivals
                </h3>

                <div className="space-y-3">

                  {newArrivals.length > 0 ? (
                    newArrivals.map(
                      (product) => (
                        <ProductMiniCard
                          key={product.id}
                          product={product}
                        />
                      )
                    )
                  ) : (
                    <p className="text-xs text-[#5e5e5e]">
                      No products available.
                    </p>
                  )}

                </div>

              </div>

              {/* TRENDING */}
              <div className="space-y-4">

                <h3 className="text-sm font-extrabold uppercase border-b border-[#e5e2e1] pb-2">
                  Trending
                </h3>

                <div className="space-y-3">

                  {trending.length > 0 ? (
                    trending.map(
                      (product) => (
                        <ProductMiniCard
                          key={product.id}
                          product={product}
                        />
                      )
                    )
                  ) : (
                    <p className="text-xs text-[#5e5e5e]">
                      No products available.
                    </p>
                  )}

                </div>

              </div>

              {/* TOP RATED */}
              <div className="space-y-4">

                <h3 className="text-sm font-extrabold uppercase border-b border-[#e5e2e1] pb-2">
                  Top Rated
                </h3>

                <div className="space-y-3">

                  {topRated.length > 0 ? (
                    topRated.map(
                      (product) => (
                        <ProductMiniCard
                          key={product.id}
                          product={product}
                        />
                      )
                    )
                  ) : (
                    <p className="text-xs text-[#5e5e5e]">
                      No products available.
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* =========================
                DEAL OF THE DAY
                ========================= */}
            <DealOfTheDay
              product={dealOfTheDay}
            />

            {/* =========================
                NEW PRODUCTS SHOWCASE
                ========================= */}
            <div className="space-y-6">

              {/* Section Header */}
              <div className="flex justify-between items-end border-b border-[#e5e2e1] pb-2">

                <h3 className="text-sm font-extrabold uppercase text-[#1b1c1c] tracking-wider">
                  New Products Showcase
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    window.location.assign(
                      "/catalog?tag=new-products"
                    )
                  }
                  className="text-xs text-[#ad2d47] font-bold hover:underline"
                >
                  Show All →
                </button>

              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                {currentProducts.length > 0 ? (
                  currentProducts.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )
                ) : (
                  <div className="col-span-full py-10 text-center text-[#5e5e5e] border border-dashed border-[#dfbfc1] rounded-xl">

                    <span className="material-symbols-outlined text-[40px]">
                      inbox
                    </span>

                    <p className="font-bold text-xs md:text-sm mt-3">
                      No products found.
                    </p>

                  </div>
                )}

              </div>

              {/* =========================
                  PAGINATION
                  MAXIMUM 5 BUTTONS
                  ========================= */}
              {totalProductPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-[#e5e2e1]">

                  <button
                    type="button"
                    disabled={
                      homeProductsPage === 1
                    }
                    onClick={() =>
                      changeHomeProductsPage(
                        Math.max(
                          1,
                          homeProductsPage - 1
                        )
                      )
                    }
                    className="h-9 px-3 rounded-lg border border-[#dfbfc1] bg-white text-xs font-bold text-[#5e5e5e] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#ad2d47] hover:text-[#ad2d47]"
                  >
                    Previous
                  </button>

                  {visiblePageNumbers.map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          changeHomeProductsPage(
                            page
                          )
                        }
                        className={`w-9 h-9 rounded-lg border font-bold text-xs shadow-sm transition-colors ${
                          page ===
                          homeProductsPage
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
                      homeProductsPage ===
                      totalProductPages
                    }
                    onClick={() =>
                      changeHomeProductsPage(
                        Math.min(
                          totalProductPages,
                          homeProductsPage + 1
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

        </div>

      </section>

      {/* =========================
          MARKETING ADS
          ========================= */}
      <MarketingAds
        ads={ads}
      />

    </main>
  );
}

export default Home;