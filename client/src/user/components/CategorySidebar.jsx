import { useState } from "react";
import { useNavigate } from "react-router";

function CategorySidebar({ categories }) {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);

  const visibleCategories = categories.filter(
    (category) => category.show_in_sidebar !== false
  );

  const toggleCategory = (categoryId) => {
    setOpenCategory((current) =>
      current === categoryId ? null : categoryId
    );
  };

  const goToCategory = (categoryId) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryId)}`);
  };

  const goToSubcategory = (categoryId, subcategory) => {
    navigate(
      `/catalog?category=${encodeURIComponent(
        categoryId
      )}&subcategory=${encodeURIComponent(subcategory)}`
    );
  };

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block col-span-1">
      <div className="border border-[#dfbfc1] rounded-xl p-5 bg-white shadow-sm space-y-4 sticky top-[150px]">
        
        <h3 className="text-sm font-extrabold text-[#1b1c1c] uppercase tracking-wider border-b border-[#e5e2e1] pb-2">
          Categories
        </h3>

        <ul className="space-y-2 text-xs">

          {visibleCategories.map((category) => {
            const hasSubcategories =
              Array.isArray(category.subcategories) &&
              category.subcategories.some(
                (subcategory) =>
                  typeof subcategory === "string" ||
                  subcategory.show_in_sidebar !== false
              );

            const isOpen = openCategory === category.id;

            return (
              <li
                key={category.id}
                className="border-b border-[#e5e2e1]/40 pb-2 last:border-b-0"
              >
                {/* Category Row */}
                <div className="flex items-center justify-between gap-2">

                  <button
                    type="button"
                    onClick={() => goToCategory(category.id)}
                    className="flex-1 text-left font-semibold text-[#5e5e5e] hover:text-[#ad2d47] text-[13px] py-1 cursor-pointer transition-colors"
                  >
                    {category.name}
                  </button>

                  {hasSubcategories && (
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="text-[#5e5e5e] hover:text-[#ad2d47] cursor-pointer p-1"
                      aria-label={`Toggle ${category.name}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isOpen ? "remove" : "add"}
                      </span>
                    </button>
                  )}

                </div>

                {/* Subcategories */}
                {hasSubcategories && isOpen && (
                  <div className="pl-4 pt-1.5 space-y-2">
                    {category.subcategories
                      .filter((subcategory) => {
                        if (typeof subcategory === "string") {
                          return true;
                        }

                        return subcategory.show_in_sidebar !== false;
                      })
                      .map((subcategory, index) => {
                        const subcategoryName =
                          typeof subcategory === "string"
                            ? subcategory
                            : subcategory.name;

                        return (
                          <button
                            key={`${category.id}-${index}`}
                            type="button"
                            onClick={() =>
                              goToSubcategory(
                                category.id,
                                subcategoryName
                              )
                            }
                            className="block w-full text-left hover:text-[#ad2d47] cursor-pointer tracking-wide text-[#5e5e5e] text-xs transition-colors"
                          >
                            · {subcategoryName}
                          </button>
                        );
                      })}
                  </div>
                )}

              </li>
            );
          })}

        </ul>
      </div>
    </aside>
  );
}

export default CategorySidebar;