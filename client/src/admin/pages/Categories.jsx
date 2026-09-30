import { useEffect, useMemo, useState } from "react";

const CATEGORY_API_URL =
  "https://purchase-online.onrender.com/api/categories";

const HERO_SLIDE_API_URL =
  "https://purchase-online.onrender.com/api/hero-slides";

function Categories({
  initialCategories = [],
  initialHeroSlides = [],
}) {
  const [categories, setCategories] =
    useState(initialCategories);

  const [heroSlides, setHeroSlides] =
    useState(initialHeroSlides);

  const [activeTab, setActiveTab] =
    useState("categories");

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const CATEGORIES_PER_PAGE = 30;

  const [showCategoryForm, setShowCategoryForm] =
    useState(false);

  const [showSlideForm, setShowSlideForm] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [editingSlide, setEditingSlide] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [savingCategory, setSavingCategory] =
    useState(false);

  const [savingSlide, setSavingSlide] =
    useState(false);

  const emptyCategory = {
    id: "",
    name: "",
    icon: "shirt-outline",
    image: "",
    show_in_scrollbar: true,
    show_in_sidebar: true,
    subcategories: [],
  };

  const emptySlide = {
    image: "",
    subtitle: "",
    title: "",
    price: "",
  };

  const [categoryForm, setCategoryForm] =
    useState(emptyCategory);

  const [slideForm, setSlideForm] =
    useState(emptySlide);

  // =========================
  // LOAD DATA FROM BACKEND
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          categoriesResponse,
          slidesResponse,
        ] = await Promise.all([
          fetch(CATEGORY_API_URL),
          fetch(HERO_SLIDE_API_URL),
        ]);

        if (!categoriesResponse.ok) {
          throw new Error(
            "Failed to fetch categories"
          );
        }

        if (!slidesResponse.ok) {
          throw new Error(
            "Failed to fetch hero slides"
          );
        }

        const categoriesData =
          await categoriesResponse.json();

        const slidesData =
          await slidesResponse.json();

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );

        setHeroSlides(
          Array.isArray(slidesData)
            ? slidesData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load categories and hero slides:",
          error
        );

        window.alert(
          "Failed to load categories and hero slides from backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =========================
  // CATEGORY FILTER
  // =========================

  const filteredCategories =
    categories.filter((category) => {
      const searchText =
        search.toLowerCase();

      return (
        category.name
          ?.toLowerCase()
          .includes(searchText) ||
        category.id
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  const totalCategoryPages = Math.max(
    1,
    Math.ceil(
      filteredCategories.length /
        CATEGORIES_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalCategoryPages
  );

  const paginatedCategories = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) *
      CATEGORIES_PER_PAGE;

    return filteredCategories.slice(
      startIndex,
      startIndex + CATEGORIES_PER_PAGE
    );
  }, [
    filteredCategories,
    safeCurrentPage,
  ]);

  const goToCategoryPage = (page) => {
    if (
      page < 1 ||
      page > totalCategoryPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  const handleCategorySearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // =========================
  // CATEGORY FORM
  // =========================

  const openAddCategory = () => {
    setEditingCategory(null);

    setCategoryForm({
      ...emptyCategory,
      id: `category-${Date.now()}`,
    });

    setShowCategoryForm(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);

    setCategoryForm({
      ...emptyCategory,
      ...category,
      subcategories:
        Array.isArray(
          category.subcategories
        )
          ? category.subcategories
          : [],
    });

    setShowCategoryForm(true);
  };

  const closeCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryForm({
      ...emptyCategory,
      subcategories: [],
    });
  };

  const handleCategoryChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setCategoryForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const addSubcategory = () => {
    setCategoryForm((previous) => ({
      ...previous,
      subcategories: [
        ...previous.subcategories,
        {
          name: "",
          show_in_scrollbar: false,
          show_in_sidebar: true,
        },
      ],
    }));
  };

  const updateSubcategory = (
    index,
    field,
    value
  ) => {
    setCategoryForm((previous) => {
      const updated = [
        ...previous.subcategories,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...previous,
        subcategories: updated,
      };
    });
  };

  const removeSubcategory = (index) => {
    setCategoryForm((previous) => ({
      ...previous,
      subcategories:
        previous.subcategories.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  };

  // =========================
  // SAVE CATEGORY
  // =========================

  const saveCategory = async (event) => {
    event.preventDefault();

    const cleanedSubcategories =
      categoryForm.subcategories
        .filter(
          (item) =>
            item.name?.trim()
        )
        .map((item) => ({
          name: item.name.trim(),
          show_in_scrollbar:
            Boolean(
              item.show_in_scrollbar
            ),
          show_in_sidebar:
            Boolean(
              item.show_in_sidebar
            ),
        }));

    const updatedCategory = {
      id: categoryForm.id.trim(),
      name: categoryForm.name.trim(),
      icon: categoryForm.icon.trim(),
      image: categoryForm.image.trim(),
      show_in_scrollbar:
        Boolean(
          categoryForm.show_in_scrollbar
        ),
      show_in_sidebar:
        Boolean(
          categoryForm.show_in_sidebar
        ),
      subcategories:
        cleanedSubcategories,
    };

    try {
      setSavingCategory(true);

      let response;

      if (editingCategory) {
        response = await fetch(
          `${CATEGORY_API_URL}/${editingCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              updatedCategory
            ),
          }
        );
      } else {
        response = await fetch(
          CATEGORY_API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              updatedCategory
            ),
          }
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save category"
        );
      }

      if (editingCategory) {
        setCategories((previous) =>
          previous.map((category) =>
            category.id ===
            editingCategory.id
              ? data
              : category
          )
        );
      } else {
        setCategories((previous) => [
          ...previous,
          data,
        ]);
      }

      closeCategoryForm();
    } catch (error) {
      console.error(
        "Failed to save category:",
        error
      );

      window.alert(
        error.message ||
          "Failed to save category."
      );
    } finally {
      setSavingCategory(false);
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================

  const deleteCategory = async (
    categoryId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${CATEGORY_API_URL}/${categoryId}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete category"
        );
      }

      setCategories((previous) =>
        previous.filter(
          (category) =>
            category.id !== categoryId
        )
      );

      const newTotalPages = Math.max(
        1,
        Math.ceil(
          (filteredCategories.length - 1) /
            CATEGORIES_PER_PAGE
        )
      );

      if (safeCurrentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      window.alert(
        error.message ||
          "Failed to delete category."
      );
    }
  };

  // =========================
  // HERO SLIDE FORM
  // =========================

  const openAddSlide = () => {
    setEditingSlide(null);
    setSlideForm(emptySlide);
    setShowSlideForm(true);
  };

  const openEditSlide = (slide) => {
    setEditingSlide(slide);

    setSlideForm({
      ...emptySlide,
      ...slide,
    });

    setShowSlideForm(true);
  };

  const closeSlideForm = () => {
    setShowSlideForm(false);
    setEditingSlide(null);
    setSlideForm(emptySlide);
  };

  const handleSlideChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setSlideForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SAVE HERO SLIDE
  // =========================

  const saveSlide = async (event) => {
    event.preventDefault();

    const updatedSlide = {
      id:
        editingSlide?.id ||
        `hero-slide-${Date.now()}`,
      image: slideForm.image.trim(),
      subtitle:
        slideForm.subtitle.trim(),
      title: slideForm.title.trim(),
      price: slideForm.price.trim(),
    };

    try {
      setSavingSlide(true);

      let response;

      if (editingSlide) {
        response = await fetch(
          `${HERO_SLIDE_API_URL}/${editingSlide.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              updatedSlide
            ),
          }
        );
      } else {
        response = await fetch(
          HERO_SLIDE_API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              updatedSlide
            ),
          }
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save hero slide"
        );
      }

      if (editingSlide) {
        setHeroSlides((previous) =>
          previous.map((slide) =>
            slide.id ===
            editingSlide.id
              ? data
              : slide
          )
        );
      } else {
        setHeroSlides((previous) => [
          ...previous,
          data,
        ]);
      }

      closeSlideForm();
    } catch (error) {
      console.error(
        "Failed to save hero slide:",
        error
      );

      window.alert(
        error.message ||
          "Failed to save hero slide."
      );
    } finally {
      setSavingSlide(false);
    }
  };

  // =========================
  // DELETE HERO SLIDE
  // =========================

  const deleteSlide = async (
    slideToDelete
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this hero slide?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${HERO_SLIDE_API_URL}/${slideToDelete.id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete hero slide"
        );
      }

      setHeroSlides((previous) =>
        previous.filter(
          (slide) =>
            slide.id !==
            slideToDelete.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete hero slide:",
        error
      );

      window.alert(
        error.message ||
          "Failed to delete hero slide."
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* =========================
          SUMMARY
          ========================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
            Categories
          </p>

          <p className="text-2xl font-extrabold mt-2">
            {categories.length}
          </p>

        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
            Subcategories
          </p>

          <p className="text-2xl font-extrabold mt-2">
            {categories.reduce(
              (total, category) =>
                total +
                (Array.isArray(
                  category.subcategories
                )
                  ? category
                      .subcategories
                      .length
                  : 0),
              0
            )}
          </p>

        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
            Hero Slides
          </p>

          <p className="text-2xl font-extrabold mt-2">
            {heroSlides.length}
          </p>

        </div>

      </div>

      {/* =========================
          TABS
          ========================= */}

      <div className="bg-white border border-[#e5e7eb] rounded-xl p-2 flex flex-col sm:flex-row gap-2">

        <button
          type="button"
          onClick={() =>
            setActiveTab("categories")
          }
          className={`flex-1 h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
            activeTab === "categories"
              ? "bg-[#ad2d47] text-white"
              : "text-[#5e6268] hover:bg-[#f5f5f5]"
          }`}
        >

          <span className="material-symbols-outlined text-[19px]">
            category
          </span>

          Categories

        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("slides")
          }
          className={`flex-1 h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
            activeTab === "slides"
              ? "bg-[#ad2d47] text-white"
              : "text-[#5e6268] hover:bg-[#f5f5f5]"
          }`}
        >

          <span className="material-symbols-outlined text-[19px]">
            view_carousel
          </span>

          Hero Slides

        </button>

      </div>

      {/* =========================
          LOADING
          ========================= */}

      {loading ? (

        <div className="bg-white border border-[#e5e7eb] rounded-xl py-20 text-center">

          <span className="material-symbols-outlined text-[42px] text-[#ad2d47] animate-spin">
            progress_activity
          </span>

          <p className="mt-3 font-bold text-[#5e6268]">
            Loading categories and hero slides...
          </p>

        </div>

      ) : (

        <>
          {/* =========================
              CATEGORIES
              ========================= */}

          {activeTab === "categories" && (
            <>

              <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                  <div>

                    <h3 className="text-lg font-bold">
                      Category Management
                    </h3>

                    <p className="text-xs text-[#6b7280] mt-1">
                      Manage main categories and their subcategories
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={openAddCategory}
                    className="h-11 px-5 rounded-lg bg-[#ad2d47] text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90"
                  >

                    <span className="material-symbols-outlined text-[19px]">
                      add
                    </span>

                    Add Category

                  </button>

                </div>

                <div className="relative mt-5">

                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                    search
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={
                      handleCategorySearch
                    }
                    placeholder="Search categories..."
                    className="w-full h-11 pl-11 pr-4 rounded-lg border border-[#dfe2e5] text-sm outline-none focus:border-[#ad2d47]"
                  />

                </div>

              </div>

              <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">

                {filteredCategories.length ===
                0 ? (

                  <div className="py-16 text-center">

                    <span className="material-symbols-outlined text-[50px] text-[#c4c7ca]">
                      category
                    </span>

                    <p className="mt-3 font-bold text-[#5e6268]">
                      No categories found
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead className="bg-[#f8f9fa]">

                        <tr>

                          <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wider text-[#6b7280]">
                            Category
                          </th>

                          <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wider text-[#6b7280]">
                            Subcategories
                          </th>

                          <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wider text-[#6b7280]">
                            Visibility
                          </th>

                          <th className="text-right px-5 py-4 font-bold text-xs uppercase tracking-wider text-[#6b7280]">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {paginatedCategories.map(
                          (category) => (

                            <tr
                              key={category.id}
                              className="border-t border-[#f0f1f2] hover:bg-[#fafafa]"
                            >

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3 min-w-[260px]">

                                  {category.image ? (

                                    <img
                                      src={
                                        category.image
                                      }
                                      alt={
                                        category.name
                                      }
                                      className="w-14 h-14 rounded-lg object-cover bg-[#f5f5f5]"
                                    />

                                  ) : (

                                    <div className="w-14 h-14 rounded-lg bg-[#f5f5f5] flex items-center justify-center">

                                      <span className="material-symbols-outlined text-[#9ca3af]">
                                        category
                                      </span>

                                    </div>

                                  )}

                                  <div>

                                    <p className="font-bold">
                                      {
                                        category.name
                                      }
                                    </p>

                                    <p className="text-xs text-[#9ca3af] mt-1">
                                      {
                                        category.id
                                      }
                                    </p>

                                  </div>

                                </div>

                              </td>

                              <td className="px-5 py-4">

                                <div className="flex flex-wrap gap-1.5 max-w-[350px]">

                                  {Array.isArray(
                                    category.subcategories
                                  ) &&
                                  category
                                    .subcategories
                                    .length >
                                    0 ? (

                                    category.subcategories.map(
                                      (
                                        subcategory,
                                        index
                                      ) => (

                                        <span
                                          key={`${category.id}-${index}`}
                                          className="px-2.5 py-1 rounded-full bg-[#f5f5f5] text-xs font-semibold text-[#5e6268]"
                                        >
                                          {
                                            subcategory.name
                                          }
                                        </span>

                                      )
                                    )

                                  ) : (

                                    <span className="text-xs text-[#9ca3af]">
                                      No subcategories
                                    </span>

                                  )}

                                </div>

                              </td>

                              <td className="px-5 py-4">

                                <div className="flex flex-col gap-1">

                                  <span
                                    className={`text-xs font-bold ${
                                      category.show_in_sidebar
                                        ? "text-green-600"
                                        : "text-[#9ca3af]"
                                    }`}
                                  >
                                    Sidebar:{" "}
                                    {category.show_in_sidebar
                                      ? "Yes"
                                      : "No"}
                                  </span>

                                  <span
                                    className={`text-xs font-bold ${
                                      category.show_in_scrollbar
                                        ? "text-blue-600"
                                        : "text-[#9ca3af]"
                                    }`}
                                  >
                                    Scrollbar:{" "}
                                    {category.show_in_scrollbar
                                      ? "Yes"
                                      : "No"}
                                  </span>

                                </div>

                              </td>

                              <td className="px-5 py-4">

                                <div className="flex items-center justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditCategory(
                                        category
                                      )
                                    }
                                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                                    title="Edit"
                                  >

                                    <span className="material-symbols-outlined text-[18px]">
                                      edit
                                    </span>

                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteCategory(
                                        category.id
                                      )
                                    }
                                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                                    title="Delete"
                                  >

                                    <span className="material-symbols-outlined text-[18px]">
                                      delete
                                    </span>

                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

                {filteredCategories.length > 0 && (
                  <div className="border-t border-[#e5e7eb] px-5 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-[#6b7280]">
                      Showing{" "}
                      {
                        (safeCurrentPage - 1) *
                          CATEGORIES_PER_PAGE +
                        1
                      }{" "}
                      to{" "}
                      {Math.min(
                        safeCurrentPage *
                          CATEGORIES_PER_PAGE,
                        filteredCategories.length
                      )}{" "}
                      of{" "}
                      {filteredCategories.length}{" "}
                      categories
                    </p>

                    {totalCategoryPages > 1 && (
                      <div className="flex flex-wrap items-center justify-end gap-1">

                        <button
                          type="button"
                          disabled={
                            safeCurrentPage === 1
                          }
                          onClick={() =>
                            goToCategoryPage(
                              safeCurrentPage - 1
                            )
                          }
                          className="h-9 px-3 rounded-lg border border-[#dfe2e5] text-xs font-bold text-[#5e6268] hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {Array.from(
                          {
                            length:
                              totalCategoryPages,
                          },
                          (_, index) =>
                            index + 1
                        ).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() =>
                              goToCategoryPage(
                                page
                              )
                            }
                            className={`min-w-9 h-9 px-3 rounded-lg text-xs font-bold ${
                              page ===
                              safeCurrentPage
                                ? "bg-[#ad2d47] text-white"
                                : "border border-[#dfe2e5] text-[#5e6268] hover:bg-[#f5f5f5]"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={
                            safeCurrentPage ===
                            totalCategoryPages
                          }
                          onClick={() =>
                            goToCategoryPage(
                              safeCurrentPage + 1
                            )
                          }
                          className="h-9 px-3 rounded-lg border border-[#dfe2e5] text-xs font-bold text-[#5e6268] hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>

                      </div>
                    )}

                  </div>
                )}

              </div>

            </>
          )}

          {/* =========================
              HERO SLIDES
              ========================= */}

          {activeTab === "slides" && (
            <>

              <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-lg font-bold">
                      Hero Slide Management
                    </h3>

                    <p className="text-xs text-[#6b7280] mt-1">
                      Manage the main promotional slider shown on the store
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={openAddSlide}
                    className="h-11 px-5 rounded-lg bg-[#ad2d47] text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90"
                  >

                    <span className="material-symbols-outlined text-[19px]">
                      add
                    </span>

                    Add Slide

                  </button>

                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {heroSlides.length === 0 ? (

                  <div className="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-xl py-16 text-center">

                    <span className="material-symbols-outlined text-[50px] text-[#c4c7ca]">
                      view_carousel
                    </span>

                    <p className="mt-3 font-bold text-[#5e6268]">
                      No hero slides found
                    </p>

                  </div>

                ) : (

                  heroSlides.map(
                    (slide) => (

                      <div
                        key={slide.id}
                        className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden"
                      >

                        <div className="relative">

                          <img
                            src={slide.image}
                            alt={
                              slide.title ||
                              "Hero slide"
                            }
                            className="w-full h-[220px] object-cover"
                          />

                          <div className="absolute top-3 right-3 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditSlide(
                                  slide
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-white/95 text-blue-600 flex items-center justify-center shadow-sm"
                            >

                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>

                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteSlide(
                                  slide
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-white/95 text-red-600 flex items-center justify-center shadow-sm"
                            >

                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>

                            </button>

                          </div>

                        </div>

                        <div className="p-5">

                          <p className="text-xs font-bold uppercase tracking-wider text-[#ad2d47]">
                            {slide.subtitle}
                          </p>

                          <h4 className="text-xl font-extrabold mt-2">
                            {slide.title}
                          </h4>

                          {slide.price && (
                            <p className="text-sm text-[#6b7280] mt-2">
                              Starting @ ₹
                              {slide.price}
                            </p>
                          )}

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </>
          )}
        </>
      )}

      {/* =========================
          CATEGORY FORM
          ========================= */}

      {showCategoryForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close"
            onClick={closeCategoryForm}
            className="absolute inset-0 bg-black/40 cursor-default"
          />

          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-xl">

            <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-5 py-4 flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Category Management
                </p>

                <h3 className="text-xl font-extrabold mt-1">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h3>

              </div>

              <button
                type="button"
                onClick={closeCategoryForm}
                className="w-9 h-9 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            <form
              onSubmit={saveCategory}
              className="p-5 space-y-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Category ID
                  </label>

                  <input
                    type="text"
                    name="id"
                    value={categoryForm.id}
                    onChange={handleCategoryChange}
                    required
                    disabled={
                      Boolean(
                        editingCategory
                      )
                    }
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47] disabled:bg-[#f5f5f5]"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Category Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      categoryForm.name
                    }
                    onChange={
                      handleCategoryChange
                    }
                    required
                    placeholder="Example: Men's"
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Icon
                  </label>

                  <input
                    type="text"
                    name="icon"
                    value={
                      categoryForm.icon
                    }
                    onChange={
                      handleCategoryChange
                    }
                    placeholder="shirt-outline"
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={
                      categoryForm.image
                    }
                    onChange={
                      handleCategoryChange
                    }
                    placeholder="https://..."
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <label className="flex items-center gap-3 p-4 rounded-xl border border-[#e5e7eb] cursor-pointer">

                  <input
                    type="checkbox"
                    name="show_in_scrollbar"
                    checked={
                      categoryForm.show_in_scrollbar
                    }
                    onChange={
                      handleCategoryChange
                    }
                    className="w-4 h-4 accent-[#ad2d47]"
                  />

                  <div>

                    <p className="text-sm font-bold">
                      Show in Scrollbar
                    </p>

                    <p className="text-xs text-[#6b7280] mt-1">
                      Display this category in the category carousel
                    </p>

                  </div>

                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-[#e5e7eb] cursor-pointer">

                  <input
                    type="checkbox"
                    name="show_in_sidebar"
                    checked={
                      categoryForm.show_in_sidebar
                    }
                    onChange={
                      handleCategoryChange
                    }
                    className="w-4 h-4 accent-[#ad2d47]"
                  />

                  <div>

                    <p className="text-sm font-bold">
                      Show in Sidebar
                    </p>

                    <p className="text-xs text-[#6b7280] mt-1">
                      Display this category in the sidebar
                    </p>

                  </div>

                </label>

              </div>

              {/* Subcategories */}

              <div>

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <h4 className="font-bold text-lg">
                      Subcategories
                    </h4>

                    <p className="text-xs text-[#6b7280] mt-1">
                      Add subcategories under this category
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="h-9 px-3 rounded-lg bg-[#ad2d47]/10 text-[#ad2d47] text-xs font-bold flex items-center gap-1.5"
                  >

                    <span className="material-symbols-outlined text-[17px]">
                      add
                    </span>

                    Add

                  </button>

                </div>

                <div className="space-y-3">

                  {categoryForm.subcategories
                    .length === 0 ? (

                    <div className="p-5 rounded-xl bg-[#f8f9fa] text-center text-sm text-[#9ca3af]">
                      No subcategories added.
                    </div>

                  ) : (

                    categoryForm.subcategories.map(
                      (
                        subcategory,
                        index
                      ) => (

                        <div
                          key={index}
                          className="p-4 border border-[#e5e7eb] rounded-xl"
                        >

                          <div className="flex flex-col md:flex-row gap-3">

                            <input
                              type="text"
                              value={
                                subcategory.name
                              }
                              onChange={(
                                event
                              ) =>
                                updateSubcategory(
                                  index,
                                  "name",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Subcategory name"
                              className="flex-1 h-10 px-3 rounded-lg border border-[#dfe2e5] text-sm outline-none focus:border-[#ad2d47]"
                            />

                            <label className="flex items-center gap-2 text-xs font-semibold">

                              <input
                                type="checkbox"
                                checked={
                                  Boolean(
                                    subcategory.show_in_scrollbar
                                  )
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateSubcategory(
                                    index,
                                    "show_in_scrollbar",
                                    event
                                      .target
                                      .checked
                                  )
                                }
                                className="accent-[#ad2d47]"
                              />

                              Scrollbar

                            </label>

                            <label className="flex items-center gap-2 text-xs font-semibold">

                              <input
                                type="checkbox"
                                checked={
                                  Boolean(
                                    subcategory.show_in_sidebar
                                  )
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateSubcategory(
                                    index,
                                    "show_in_sidebar",
                                    event
                                      .target
                                      .checked
                                  )
                                }
                                className="accent-[#ad2d47]"
                              />

                              Sidebar

                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                removeSubcategory(
                                  index
                                )
                              }
                              className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"
                            >

                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>

                            </button>

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

              <div className="border-t border-[#e5e7eb] pt-5 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeCategoryForm}
                  disabled={savingCategory}
                  className="h-11 px-5 rounded-lg border border-[#dfe2e5] text-sm font-bold text-[#5e6268] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingCategory}
                  className="h-11 px-6 rounded-lg bg-[#ad2d47] text-white text-sm font-bold disabled:opacity-60"
                >
                  {savingCategory
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================
          HERO SLIDE FORM
          ========================= */}

      {showSlideForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close"
            onClick={closeSlideForm}
            className="absolute inset-0 bg-black/40 cursor-default"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">

            <div className="border-b border-[#e5e7eb] px-5 py-4 flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Hero Slider
                </p>

                <h3 className="text-xl font-extrabold mt-1">
                  {editingSlide
                    ? "Edit Hero Slide"
                    : "Add Hero Slide"}
                </h3>

              </div>

              <button
                type="button"
                onClick={closeSlideForm}
                className="w-9 h-9 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>

            <form
              onSubmit={saveSlide}
              className="p-5 space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-[#5e6268] mb-2">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={slideForm.image}
                  onChange={handleSlideChange}
                  required
                  placeholder="https://..."
                  className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-[#5e6268] mb-2">
                  Subtitle
                </label>

                <input
                  type="text"
                  name="subtitle"
                  value={
                    slideForm.subtitle
                  }
                  onChange={
                    handleSlideChange
                  }
                  placeholder="Trending Item"
                  className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-[#5e6268] mb-2">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={slideForm.title}
                  onChange={handleSlideChange}
                  required
                  placeholder="Women's latest fashion sale"
                  className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-[#5e6268] mb-2">
                  Price
                </label>

                <input
                  type="text"
                  name="price"
                  value={slideForm.price}
                  onChange={handleSlideChange}
                  placeholder="20.00"
                  className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                />

              </div>

              <div className="pt-3 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeSlideForm}
                  disabled={savingSlide}
                  className="h-11 px-5 rounded-lg border border-[#dfe2e5] text-sm font-bold text-[#5e6268] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingSlide}
                  className="h-11 px-6 rounded-lg bg-[#ad2d47] text-white text-sm font-bold disabled:opacity-60"
                >
                  {savingSlide
                    ? "Saving..."
                    : editingSlide
                    ? "Update Slide"
                    : "Add Slide"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Categories;