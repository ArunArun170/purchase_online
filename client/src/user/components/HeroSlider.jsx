function HeroSlider({ slides }) {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1200px] mx-auto px-5 mt-6">
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory rounded-2xl scrollbar-hide">

        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full relative snap-start h-[200px] sm:h-[260px] md:h-[400px] bg-surface-container rounded-2xl overflow-hidden border border-outline-variant"
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent flex items-center p-6 md:p-16">
              
              <div className="max-w-md space-y-2 md:space-y-3">

                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-secondary uppercase tracking-wider">
                  {slide.subtitle}
                </p>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase leading-tight text-on-background">
                  {slide.title}
                </h1>

                <p className="text-xs md:text-sm font-medium text-on-background">
                  starting at $
                  <b className="text-lg md:text-2xl ml-1">
                    {slide.price}
                  </b>
                </p>

                <button
                  className="bg-primary text-white px-4 md:px-5 py-2 rounded-md uppercase font-bold text-[10px] md:text-xs shadow hover:bg-surface-tint mt-2"
                >
                  Shop Now
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}

export default HeroSlider;