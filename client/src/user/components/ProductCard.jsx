import { useNavigate } from "react-router";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const isAvailable =
    product.available !== false &&
    product.available !== "false" &&
    Number(product.stock ?? 1) > 0;

  const openProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    if (!isAvailable) {
      alert("This product is currently unavailable.");
      return;
    }

    try {
      const existingCart = JSON.parse(
        localStorage.getItem(
          "anon_cart_items"
        ) || "[]"
      );

      const existingIndex =
        existingCart.findIndex(
          (item) =>
            item.id === product.id &&
            !item.color &&
            !item.size
        );

      if (existingIndex !== -1) {
        const currentQty = Number(
          existingCart[existingIndex].qty || 0
        );

        const stock = Number(product.stock);

        if (Number.isFinite(stock) && stock > 0 && currentQty >= stock) {
          alert("Maximum available stock already added to cart.");
          return;
        }

        existingCart[existingIndex].qty =
          currentQty + 1;
      } else {
        existingCart.push({
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          image: product.image,
          qty: 1,
          color: null,
          size: null,
        });
      }

      localStorage.setItem(
        "anon_cart_items",
        JSON.stringify(existingCart)
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert(
        `1x ${product.name} added to cart!`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e5e2e1] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all group">

      {/* =========================
          PRODUCT IMAGE
          ========================= */}
      <div
        onClick={openProduct}
        className="relative aspect-square md:aspect-[4/3] bg-[#f0eded] cursor-pointer overflow-hidden"
      >

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#ad2d47] text-white text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold rounded uppercase shadow-sm">
            {product.badge}
          </span>
        )}

        {!isAvailable && (
          <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="bg-white text-[#ad2d47] px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase">
              Out of Stock
            </span>
          </span>
        )}

      </div>


      {/* =========================
          PRODUCT DETAILS
          ========================= */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">

        {/* Subcategory */}
        <p className="text-[9px] md:text-[10px] text-[#ad2d47] uppercase font-bold tracking-wider mb-1">
          {product.subcategory || "Collection"}
        </p>


        {/* Product Name */}
        <h3
          onClick={openProduct}
          className="font-bold text-xs md:text-sm leading-tight text-[#1b1c1c] cursor-pointer hover:text-[#ad2d47] transition-colors line-clamp-2 mb-2 md:mb-3"
        >
          {product.name}
        </h3>


        {/* =========================
            PRICE + ADD BUTTON
            ========================= */}
        <div className="mt-auto flex items-center justify-between gap-2">

          {/* Price */}
          <div className="flex flex-col min-w-0">

            <span className="font-extrabold text-sm md:text-base text-[#1b1c1c]">
              ${Number(product.price || 0).toFixed(2)}
            </span>

            {product.oldPrice && (
              <del className="text-[9px] md:text-[10px] text-[#5e5e5e] font-semibold">
                ${Number(product.oldPrice).toFixed(2)}
              </del>
            )}

          </div>


          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-[9px] md:text-[10px] uppercase transition-transform shadow-sm flex items-center justify-center flex-shrink-0 ${
              isAvailable
                ? "bg-[#ad2d47] text-white active:scale-90"
                : "bg-[#d6d3d1] text-[#78716c] cursor-not-allowed"
            }`}
          >

            {/* Mobile */}
            <span className="md:hidden material-symbols-outlined text-[14px]">
              add
            </span>

            {/* Desktop */}
            <span className="hidden md:inline">
              {isAvailable ? "Add" : "Unavailable"}
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;