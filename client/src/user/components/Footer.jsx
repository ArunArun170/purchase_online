import { useNavigate } from "react-router";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#f0eded] border-t border-[#e5e2e1] mt-auto">

      <div className="w-full py-12 px-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-[1200px] mx-auto">

        {/* =========================
            BRAND
            ========================= */}
        <div className="col-span-2">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-black text-3xl text-[#ad2d47] mb-4 block tracking-tight cursor-pointer"
          >
            Anon<span className="text-[#ff6b81]">.</span>
          </button>

          <p className="text-sm text-[#5e5e5e] mb-6 max-w-xs leading-relaxed">
            Your neighborhood premium market, delivered. Experience the best
            quality produce and groceries at the tap of a button.
          </p>

          <div className="flex gap-4">

            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="w-8 h-8 rounded-full bg-[#ad2d47]/10 flex items-center justify-center text-[#ad2d47] hover:bg-[#ad2d47] hover:text-white transition-all"
              aria-label="Website"
            >
              <span className="material-symbols-outlined text-[18px]">
                public
              </span>
            </a>

            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="w-8 h-8 rounded-full bg-[#ad2d47]/10 flex items-center justify-center text-[#ad2d47] hover:bg-[#ad2d47] hover:text-white transition-all"
              aria-label="Share"
            >
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
            </a>

          </div>
        </div>


        {/* =========================
            SHOP
            ========================= */}
        <div>

          <h4 className="font-bold text-[#1b1c1c] mb-6 uppercase tracking-wider text-[12px]">
            Shop
          </h4>

          <ul className="space-y-4 text-sm text-[#5e5e5e]">

            <li>
              <button
                type="button"
                onClick={() => navigate("/catalog")}
                className="hover:underline hover:text-[#ad2d47] transition-colors cursor-pointer text-left"
              >
                Mens Fashion
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => navigate("/catalog")}
                className="hover:underline hover:text-[#ad2d47] transition-colors cursor-pointer text-left"
              >
                Womens Fashion
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => navigate("/catalog")}
                className="hover:underline hover:text-[#ad2d47] transition-colors cursor-pointer text-left"
              >
                Accessories
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => navigate("/catalog?tag=deal-of-the-day")}
                className="hover:underline hover:text-[#ad2d47] transition-colors cursor-pointer text-left"
              >
                Hot Deals
              </button>
            </li>

          </ul>
        </div>


        {/* =========================
            SUPPORT
            ========================= */}
        <div>

          <h4 className="font-bold text-[#1b1c1c] mb-6 uppercase tracking-wider text-[12px]">
            Support
          </h4>

          <ul className="space-y-4 text-sm text-[#5e5e5e]">

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Help Center
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Shipping Info
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Track Order
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Returns
              </a>
            </li>

          </ul>
        </div>


        {/* =========================
            COMPANY
            ========================= */}
        <div>

          <h4 className="font-bold text-[#1b1c1c] mb-6 uppercase tracking-wider text-[12px]">
            Company
          </h4>

          <ul className="space-y-4 text-sm text-[#5e5e5e]">

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Careers
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Privacy Policy
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="hover:underline hover:text-[#ad2d47] transition-colors"
              >
                Terms of Service
              </a>
            </li>

          </ul>
        </div>


        {/* =========================
            DOWNLOAD APP
            ========================= */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1">

          <h4 className="font-bold text-[#1b1c1c] mb-6 uppercase tracking-wider text-[12px]">
            Download App
          </h4>

          <div className="space-y-4">

            <button
              type="button"
              className="w-full bg-[#1b1c1c] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined">
                apps
              </span>

              <div className="text-left">
                <p className="text-[8px] uppercase">
                  Download on
                </p>

                <p className="font-bold text-[12px]">
                  App Store
                </p>
              </div>
            </button>


            <button
              type="button"
              className="w-full bg-[#1b1c1c] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined">
                play_arrow
              </span>

              <div className="text-left">
                <p className="text-[8px] uppercase">
                  Get it on
                </p>

                <p className="font-bold text-[12px]">
                  Google Play
                </p>
              </div>
            </button>

          </div>

        </div>

      </div>


      {/* =========================
          COPYRIGHT
          ========================= */}
      <div className="w-full py-6 px-5 border-t border-[#e5e2e1] max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-[60px] md:mb-0">

        <p className="text-xs md:text-sm text-[#5e5e5e] text-center md:text-left">
          © 2026 Anon. All rights reserved. Premium eCommerce.
        </p>

        <div className="flex gap-4 md:gap-8 text-[10px] md:text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider">

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="hover:text-[#ad2d47] transition-colors"
          >
            PRIVACY
          </a>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="hover:text-[#ad2d47] transition-colors"
          >
            TERMS
          </a>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="hover:text-[#ad2d47] transition-colors"
          >
            COOKIES
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;