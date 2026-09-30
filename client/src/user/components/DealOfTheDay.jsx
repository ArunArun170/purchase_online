import { useNavigate } from "react-router";

function DealOfTheDay({ product }) {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const openProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="space-y-4">

      {/* Title */}
      <h3 className="text-sm font-extrabold uppercase tracking-wider pb-2 border-b border-[#dfbfc1]">
        Deal of the Day
      </h3>

      {/* Deal Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-[#dfbfc1] rounded-2xl p-6 bg-white shadow-sm items-center">

        {/* Product Image */}
        <div
          onClick={openProduct}
          className="w-full h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer relative bg-[#f0eded]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#ad2d47] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-3">

          <h3
            onClick={openProduct}
            className="font-bold text-lg md:text-xl cursor-pointer hover:text-[#ad2d47] leading-tight"
          >
            {product.name}
          </h3>

          <div className="flex items-end gap-3 pb-4 border-b border-[#e5e2e1]">
            <span className="font-extrabold text-2xl md:text-3xl text-[#ad2d47]">
              ${Number(product.price || 0).toFixed(2)}
            </span>

            {product.oldPrice && (
              <del className="text-sm md:text-base text-[#5e5e5e]">
                ${Number(product.oldPrice).toFixed(2)}
              </del>
            )}
          </div>

          {product.description && (
            <p className="text-xs md:text-sm text-[#5e5e5e] leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Button */}
          <button
            type="button"
            onClick={openProduct}
            className="w-full bg-[#ad2d47] text-white font-bold text-xs md:text-sm uppercase py-3 md:py-3.5 rounded-lg hover:bg-[#8c1231] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              shopping_bag
            </span>
            Add to Cart
          </button>

        </div>
      </div>
    </div>
  );
}

export default DealOfTheDay;