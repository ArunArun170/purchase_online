import { useNavigate } from "react-router";

function MarketingAds({ ads }) {
  const navigate = useNavigate();

  if (!ads) {
    return null;
  }

  const handleAdClick = (link) => {
    if (link) {
      navigate(`/catalog?category=${encodeURIComponent(link)}`);
    } else {
      navigate("/catalog");
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-5 pt-4 pb-12">

      {/* =========================
          TESTIMONIAL + MID BANNER
          ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

        {/* =========================
            TESTIMONIAL
            ========================= */}
        {ads.testimonial && (
          <div className="lg:col-span-1">

            <div className="bg-white rounded-xl border border-[#e5e2e1] p-8 flex flex-col items-center justify-center text-center shadow-sm h-full relative overflow-hidden">

              <h3 className="font-bold text-lg mb-8 w-full text-left text-[#1b1c1c] uppercase tracking-wider">
                Testimonial
              </h3>

              <img
                src={ads.testimonial.image}
                alt={ads.testimonial.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#fcf9f8] shadow-sm mb-4 relative z-10"
              />

              <h4 className="font-bold text-base text-[#1b1c1c] tracking-wide uppercase">
                {ads.testimonial.name}
              </h4>

              <p className="text-[10px] font-semibold text-[#5e5e5e] mb-5 tracking-widest uppercase">
                {ads.testimonial.role}
              </p>

              {/* Quote Icon */}
              <span className="material-symbols-outlined text-[#ad2d47]/10 text-[80px] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                format_quote
              </span>

              <p className="text-sm text-[#5e5e5e] italic relative z-10 font-medium">
                "{ads.testimonial.quote}"
              </p>

            </div>

          </div>
        )}


        {/* =========================
            MIDDLE BANNER
            ========================= */}
        {ads.mid_image && (
          <div className="lg:col-span-2">

            <div
              onClick={() => handleAdClick(ads.mid_image.link)}
              className="relative rounded-xl overflow-hidden h-full min-h-[350px] shadow-sm cursor-pointer group border border-[#e5e2e1]"
            >

              <img
                src={ads.mid_image.image}
                alt={ads.mid_image.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">

                <span className="bg-[#ad2d47] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm mb-4 shadow-sm">
                  {ads.mid_image.badge}
                </span>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-1 drop-shadow-md">
                  {ads.mid_image.title}
                </h2>

                <p className="text-sm font-semibold text-white/90 mb-6 drop-shadow-md">
                  {ads.mid_image.subtitle}
                </p>

                <span className="border-b-2 border-[#ad2d47] text-white font-bold text-xs uppercase tracking-wider pb-1 hover:text-[#ff6b81] transition-all">
                  Shop Now
                </span>

              </div>

            </div>

          </div>
        )}

      </div>


      {/* =========================
          SMALL AD CARDS
          ========================= */}
      {Array.isArray(ads.ad_images) && ads.ad_images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-[#e5e2e1]">

          {ads.ad_images.map((ad, index) => (
            <div
              key={index}
              onClick={() => handleAdClick(ad.link)}
              className={`group cursor-pointer ${
                index >= 2 ? "hidden md:block" : ""
              }`}
            >

              {/* Image */}
              <div className="rounded-xl overflow-hidden mb-3 aspect-[4/3] bg-[#f0eded] border border-[#e5e2e1]">

                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

              </div>

              {/* Category */}
              <span className="text-[10px] font-bold text-[#ad2d47] uppercase tracking-wider">
                {ad.category}
              </span>

              {/* Title */}
              <h3 className="font-bold text-sm text-[#1b1c1c] mt-1 group-hover:text-[#ad2d47] transition-colors line-clamp-2">
                {ad.title}
              </h3>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default MarketingAds;