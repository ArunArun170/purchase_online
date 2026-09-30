import { useNavigate } from "react-router";

function ProductMiniCard({ product }) {
  const navigate = useNavigate();

  const openProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={openProduct}
      className="flex items-center gap-3 bg-white p-2.5 md:p-3 border border-[#dfbfc1] rounded-xl hover:border-[#ad2d47] cursor-pointer group shadow-sm transition-colors"
    >
      {/* Product Image */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border border-[#dfbfc1] flex-shrink-0 bg-[#f0eded]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[10px] md:text-[11px] truncate group-hover:text-[#ad2d47]">
          {product.name}
        </h4>

        <span className="font-bold text-[10px] md:text-xs text-[#ad2d47] mt-0.5 block">
          ${Number(product.price || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default ProductMiniCard;