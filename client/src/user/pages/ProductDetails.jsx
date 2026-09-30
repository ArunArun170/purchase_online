import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        // =========================
        // LOAD PRODUCT FROM BACKEND
        // =========================
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setProduct(null);
            return;
          }

          throw new Error(
            `Products API HTTP Error: ${response.status}`
          );
        }

        const foundProduct =
          await response.json();

        setProduct(foundProduct);

        if (foundProduct) {
          setSelectedImage(
            foundProduct.image || ""
          );

          if (
            Array.isArray(
              foundProduct.colors
            ) &&
            foundProduct.colors.length > 0
          ) {
            setSelectedColor(
              foundProduct.colors[0].name
            );
          }

          if (
            Array.isArray(
              foundProduct.sizes
            ) &&
            foundProduct.sizes.length > 0
          ) {
            setSelectedSize(
              foundProduct.sizes[0]
            );
          }
        }
      } catch (error) {
        console.error(
          "Product loading error:",
          error
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="grow flex items-center justify-center py-20 px-5">
        <div className="text-center">

          <span className="material-symbols-outlined text-[45px] text-[#ad2d47] animate-spin">
            progress_activity
          </span>

          <p className="text-sm text-[#5e5e5e] mt-3 font-semibold">
            Loading product...
          </p>

        </div>
      </main>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================
  if (!product) {
    return (
      <main className="grow flex items-center justify-center py-20 px-5">
        <div className="text-center">

          <span className="material-symbols-outlined text-[60px] text-[#dfbfc1]">
            inventory_2
          </span>

          <h1 className="text-xl md:text-2xl font-bold uppercase mt-4">
            Product Not Found
          </h1>

          <p className="text-sm text-[#5e5e5e] mt-2">
            The product you are looking for is not available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 px-7 py-3 bg-[#ad2d47] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#8c1231] transition-all"
          >
            Back to Home
          </button>

        </div>
      </main>
    );
  }

  const isAvailable =
    product.available !== false &&
    product.available !== "false" &&
    Number(product.stock ?? 1) > 0;

  const stockLimit =
    Number(product.stock);

  const hasStockLimit =
    Number.isFinite(stockLimit) &&
    stockLimit > 0;

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = () => {
    if (!isAvailable) {
      alert(
        "This product is currently unavailable."
      );
      return;
    }

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "anon_cart_items"
        ) || "[]"
      );

    const existingIndex =
      existingCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.color === selectedColor &&
          item.size === selectedSize
      );

    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(
        product.price || 0
      ),
      image: product.image,
      qty: quantity,
      color: selectedColor,
      size: selectedSize,
    };

    if (existingIndex !== -1) {
      const existingQuantity =
        Number(
          existingCart[
            existingIndex
          ].qty || 0
        );

      if (
        hasStockLimit &&
        existingQuantity +
          quantity >
          stockLimit
      ) {
        alert(
          `Only ${Math.max(
            stockLimit -
              existingQuantity,
            0
          )} more item(s) can be added.`
        );

        return;
      }

      existingCart[
        existingIndex
      ].qty =
        existingQuantity +
        quantity;
    } else {
      if (
        hasStockLimit &&
        quantity > stockLimit
      ) {
        alert(
          `Only ${stockLimit} item(s) are available.`
        );

        return;
      }

      existingCart.push(
        cartItem
      );
    }

    localStorage.setItem(
      "anon_cart_items",
      JSON.stringify(
        existingCart
      )
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    alert(
      `${quantity}x ${product.name} added to cart!`
    );
  };

  // =========================
  // QUANTITY
  // =========================
  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        current > 1
          ? current - 1
          : 1
    );
  };

  const increaseQuantity = () => {
    setQuantity(
      (current) => {
        if (hasStockLimit) {
          return Math.min(
            current + 1,
            stockLimit
          );
        }

        return current + 1;
      }
    );
  };

  // =========================
  // IMAGE LIST
  // =========================
  const productImages = [
    product.image,
    product.hoverImage,
  ].filter(Boolean);

  // Remove duplicate image
  const uniqueImages = [
    ...new Set(productImages),
  ];

  return (
    <main className="grow">

      {/* =========================
          PRODUCT DETAILS
          ========================= */}
      <section className="max-w-[1200px] mx-auto px-5 py-6 md:py-10">

        {/* Back to Home */}
        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          className="flex items-center gap-2 text-xs text-[#5e5e5e] mb-6 hover:text-[#ad2d47] transition-colors"
        >

          <span className="material-symbols-outlined text-[14px]">
            arrow_back
          </span>

          Back to Home

        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-start">

          {/* =========================
              LEFT - IMAGES
              ========================= */}
          <div className="space-y-4">

            {/* Main Image */}
            <div className="relative aspect-square md:aspect-[3/4] bg-[#f0eded] rounded-lg overflow-hidden border border-[#dfbfc1] shadow-sm">

              <img
                src={
                  selectedImage ||
                  product.image
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#ad2d47] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase">
                  {product.badge}
                </span>
              )}

            </div>

            {/* Thumbnails */}
            {uniqueImages.length >
              1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">

                {uniqueImages.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() =>
                        setSelectedImage(
                          image
                        )
                      }
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage ===
                        image
                          ? "border-[#ad2d47] ring-2 ring-[#ad2d47]/20"
                          : "border-[#dfbfc1] hover:border-[#ad2d47]"
                      }`}
                    >

                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              RIGHT - PRODUCT INFO
              ========================= */}
          <div className="flex flex-col gap-5">

            {/* Category */}
            <p className="text-[#ad2d47] font-bold text-[10px] md:text-xs uppercase mb-1 tracking-wider">
              {product.category ||
                "Category"}

              {product.subcategory
                ? ` / ${product.subcategory}`
                : ""}
            </p>

            {/* Product Name */}
            <h1 className="font-bold text-xl md:text-3xl text-[#1b1c1c] leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-1">

                  {Array.from(
                    { length: 5 },
                    (_, index) => (
                      <span
                        key={index}
                        className={`material-symbols-outlined text-[17px] ${
                          index <
                          Number(
                            product.rating
                          )
                            ? "text-[#ffb400] filled"
                            : "text-[#dfbfc1]"
                        }`}
                      >
                        star
                      </span>
                    )
                  )}

                </div>

                {product.reviewCount && (
                  <span className="text-xs text-[#5e5e5e]">
                    (
                    {
                      product.reviewCount
                    }{" "}
                    reviews)
                  </span>
                )}

              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-4 border-b border-[#e5e2e1] pb-4">

              <span className="font-bold text-[#ad2d47] text-2xl md:text-4xl leading-none">
                $
                {Number(
                  product.price || 0
                ).toFixed(2)}
              </span>

              {product.oldPrice && (
                <del className="text-[#5e5e5e] line-through text-base md:text-lg">
                  $
                  {Number(
                    product.oldPrice
                  ).toFixed(2)}
                </del>
              )}

            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[#5e5e5e] text-xs md:text-sm leading-relaxed">
                {
                  product.description
                }
              </p>
            )}

            {/* =========================
                COLORS
                ========================= */}
            {Array.isArray(
              product.colors
            ) &&
              product.colors.length >
                0 && (
                <div>

                  <div className="flex items-center gap-2 mb-2">

                    <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider">
                      Colors:
                    </h3>

                    <span className="text-xs md:text-sm text-[#5e5e5e] font-medium">
                      {
                        selectedColor
                      }
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    {product.colors.map(
                      (color) => (
                        <button
                          key={
                            color.name
                          }
                          type="button"
                          title={
                            color.name
                          }
                          onClick={() =>
                            setSelectedColor(
                              color.name
                            )
                          }
                          style={{
                            backgroundColor:
                              color.hex,
                          }}
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                            selectedColor ===
                            color.name
                              ? "border-[#ad2d47] ring-2 ring-[#ad2d47] ring-offset-2"
                              : "border-[#dfbfc1] hover:border-[#ad2d47]"
                          }`}
                        />
                      )
                    )}

                  </div>

                </div>
              )}

            {/* =========================
                SIZES
                ========================= */}
            {Array.isArray(
              product.sizes
            ) &&
              product.sizes.length >
                0 && (
                <div>

                  <div className="flex items-center gap-2 mb-2">

                    <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider">
                      Select Size:
                    </h3>

                    <span className="text-xs md:text-sm text-[#5e5e5e] font-medium">
                      {
                        selectedSize
                      }
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {product.sizes.map(
                      (size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSize(
                              size
                            )
                          }
                          className={`min-w-[40px] md:min-w-[48px] h-8 md:h-10 px-2 md:px-3 border rounded-md font-bold text-xs md:text-sm transition-colors ${
                            selectedSize ===
                            size
                              ? "bg-[#ad2d47] text-white border-[#ad2d47]"
                              : "text-[#5e5e5e] border-[#dfbfc1] hover:border-[#ad2d47] hover:text-[#ad2d47] bg-white"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* =========================
                STOCK
                ========================= */}
            <div className="flex flex-wrap gap-4 text-xs text-[#5e5e5e]">

              {product.available !==
                undefined && (
                <span>
                  Available:{" "}
                  <strong className="text-[#1b1c1c]">
                    {
                      product.available
                    }
                  </strong>
                </span>
              )}

              {product.sold !==
                undefined && (
                <span>
                  Sold:{" "}
                  <strong className="text-[#1b1c1c]">
                    {product.sold}
                  </strong>
                </span>
              )}

            </div>

            {/* =========================
                QUANTITY + CART
                ========================= */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#e5e2e1] mt-2">

              {/* Quantity */}
              <div className="flex items-center border border-[#dfbfc1] rounded-md h-12 bg-white flex-shrink-0">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    !isAvailable ||
                    quantity <= 1
                  }
                  className="px-4 text-[#5e5e5e] hover:text-[#ad2d47] font-bold text-lg"
                >
                  -
                </button>

                <span className="w-12 text-center font-bold bg-transparent text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    !isAvailable ||
                    (hasStockLimit &&
                      quantity >=
                        stockLimit)
                  }
                  className="px-4 text-[#5e5e5e] hover:text-[#ad2d47] font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>

              </div>

              {/* Add To Cart */}
              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  !isAvailable
                }
                className={`flex-1 min-w-[200px] h-12 rounded-md font-bold shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs md:text-sm ${
                  isAvailable
                    ? "bg-[#ad2d47] text-white hover:bg-[#8c1231] active:scale-95"
                    : "bg-[#d6d3d1] text-[#78716c] cursor-not-allowed"
                }`}
              >

                <span className="material-symbols-outlined text-[18px]">
                  shopping_bag
                </span>

                ADD TO CART

              </button>

            </div>

            {/* =========================
                FEATURES
                ========================= */}
            {Array.isArray(
              product.features
            ) &&
              product.features.length >
                0 && (
                <div className="border-t border-[#e5e2e1] pt-5 mt-2">

                  <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider mb-3">
                    Product Features
                  </h3>

                  <ul className="space-y-2">

                    {product.features.map(
                      (
                        feature,
                        index
                      ) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs md:text-sm text-[#5e5e5e]"
                        >

                          <span className="material-symbols-outlined text-[16px] text-[#ad2d47] mt-0.5">
                            check
                          </span>

                          <span>
                            {feature}
                          </span>

                        </li>
                      )
                    )}

                  </ul>

                </div>
              )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;