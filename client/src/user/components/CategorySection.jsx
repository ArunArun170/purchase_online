import { useNavigate } from "react-router";

function CategorySection({ categories }) {
  const navigate = useNavigate();

  const visibleCategories = categories.filter(
    (category) => category.show_in_scrollbar !== false
  );

  if (visibleCategories.length === 0) {
    return null;
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section className="max-w-[1200px] mx-auto px-5 mt-8">
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {visibleCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategoryClick(category.id)}
            className="min-w-[180px] md:min-w-[240px] snap-start border border-[#dfbfc1] rounded-xl p-2 md:p-3 flex items-center gap-3 md:gap-4 bg-white hover:border-[#ad2d47] cursor-pointer flex-shrink-0 group text-left transition-colors"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#f0eded]">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-bold text-[10px] md:text-xs uppercase truncate group-hover:text-[#ad2d47]">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;