import { useState } from "react";

function Ads({ initialAds = {} }) {
  const defaultAds = {
    testimonial: {
      image: "",
      name: "",
      role: "",
      quote: "",
    },

    mid_image: {
      image: "",
      badge: "",
      title: "",
      subtitle: "",
      link: "",
    },

    ad_images: [],
  };

  const [ads, setAds] = useState({
    ...defaultAds,
    ...initialAds,

    testimonial: {
      ...defaultAds.testimonial,
      ...(initialAds.testimonial || {}),
    },

    mid_image: {
      ...defaultAds.mid_image,
      ...(initialAds.mid_image || {}),
    },

    ad_images: Array.isArray(initialAds.ad_images)
      ? initialAds.ad_images
      : [],
  });

  const [activeTab, setActiveTab] =
    useState("testimonial");

  const [editingAdIndex, setEditingAdIndex] =
    useState(null);

  const [showAdForm, setShowAdForm] =
    useState(false);

  const [adsPage, setAdsPage] = useState(1);
  const ADS_PER_PAGE = 30;

  const emptyAd = {
    image: "",
    category: "",
    title: "",
    link: "",
  };

  const [adForm, setAdForm] =
    useState(emptyAd);

  const updateTestimonial = (
    field,
    value
  ) => {
    setAds((previous) => ({
      ...previous,

      testimonial: {
        ...previous.testimonial,
        [field]: value,
      },
    }));
  };

  const updateMidImage = (
    field,
    value
  ) => {
    setAds((previous) => ({
      ...previous,

      mid_image: {
        ...previous.mid_image,
        [field]: value,
      },
    }));
  };

  const saveAdsToMongoDB = async (nextAds) => {
    const response = await fetch(
      "http://localhost:5000/api/ads",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextAds),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Ads API HTTP Error: ${response.status}`
      );
    }

    const savedAds = await response.json();
    setAds(savedAds);
  };

  const saveTestimonial = async () => {
    try {
      await saveAdsToMongoDB(ads);
      alert("Testimonial saved successfully.");
    } catch (error) {
      console.error("Testimonial save error:", error);
      alert("Failed to save testimonial. Please check the backend.");
    }
  };

  const saveMidImage = async () => {
    try {
      await saveAdsToMongoDB(ads);
      alert("Promotional banner saved successfully.");
    } catch (error) {
      console.error("Banner save error:", error);
      alert("Failed to save banner. Please check the backend.");
    }
  };

  const openAddAd = () => {
    setEditingAdIndex(null);
    setAdForm(emptyAd);
    setShowAdForm(true);
  };

  const openEditAd = (index) => {
    setEditingAdIndex(index);

    setAdForm({
      ...emptyAd,
      ...ads.ad_images[index],
    });

    setShowAdForm(true);
  };

  const closeAdForm = () => {
    setEditingAdIndex(null);
    setAdForm(emptyAd);
    setShowAdForm(false);
  };

  const handleAdChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setAdForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveAd = async (event) => {
    event.preventDefault();

    const nextAds = {
      ...ads,
      ad_images:
        editingAdIndex !== null
          ? ads.ad_images.map((ad, index) =>
              index === editingAdIndex
                ? adForm
                : ad
            )
          : [...ads.ad_images, adForm],
    };

    try {
      await saveAdsToMongoDB(nextAds);

      if (editingAdIndex === null) {
        setAdsPage(1);
      }

      closeAdForm();
      alert(
        editingAdIndex !== null
          ? "Advertisement updated successfully."
          : "Advertisement added successfully."
      );
    } catch (error) {
      console.error("Advertisement save error:", error);
      alert("Failed to save advertisement. Please check the backend.");
    }
  };

  const deleteAd = async (index) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this advertisement?"
      );

    if (!confirmed) {
      return;
    }

    const nextAds = {
      ...ads,
      ad_images: ads.ad_images.filter(
        (_, adIndex) => adIndex !== index
      ),
    };

    try {
      await saveAdsToMongoDB(nextAds);

      setAdsPage((currentPage) => {
        const remaining = nextAds.ad_images.length;
        const totalPages = Math.max(
          1,
          Math.ceil(remaining / ADS_PER_PAGE)
        );
        return Math.min(currentPage, totalPages);
      });
    } catch (error) {
      console.error("Advertisement delete error:", error);
      alert("Failed to delete advertisement. Please check the backend.");
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
            Testimonial
          </p>

          <p className="text-2xl font-extrabold mt-2">
            1
          </p>

        </div>


        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
            Promotional Banner
          </p>

          <p className="text-2xl font-extrabold mt-2">
            1
          </p>

        </div>


        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
            Advertisement Cards
          </p>

          <p className="text-2xl font-extrabold mt-2">
            {ads.ad_images.length}
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
            setActiveTab("testimonial")
          }
          className={`flex-1 h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
            activeTab === "testimonial"
              ? "bg-[#ad2d47] text-white"
              : "text-[#5e6268] hover:bg-[#f5f5f5]"
          }`}
        >

          <span className="material-symbols-outlined text-[19px]">
            format_quote
          </span>

          Testimonial

        </button>


        <button
          type="button"
          onClick={() =>
            setActiveTab("banner")
          }
          className={`flex-1 h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
            activeTab === "banner"
              ? "bg-[#ad2d47] text-white"
              : "text-[#5e6268] hover:bg-[#f5f5f5]"
          }`}
        >

          <span className="material-symbols-outlined text-[19px]">
            image
          </span>

          Promotional Banner

        </button>


        <button
          type="button"
          onClick={() =>
            setActiveTab("ads")
          }
          className={`flex-1 h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
            activeTab === "ads"
              ? "bg-[#ad2d47] text-white"
              : "text-[#5e6268] hover:bg-[#f5f5f5]"
          }`}
        >

          <span className="material-symbols-outlined text-[19px]">
            collections
          </span>

          Advertisement Cards

        </button>

      </div>


      {/* =========================
          TESTIMONIAL
          ========================= */}

      {activeTab === "testimonial" && (

        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-[#e5e7eb]">

            <h3 className="text-lg font-bold">
              Customer Testimonial
            </h3>

            <p className="text-xs text-[#6b7280] mt-1">
              Manage the customer testimonial displayed on the website.
            </p>

          </div>


          <div className="p-5">

            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6">

              <div>

                {ads.testimonial.image ? (

                  <img
                    src={
                      ads.testimonial.image
                    }
                    alt={
                      ads.testimonial.name ||
                      "Testimonial"
                    }
                    className="w-36 h-36 rounded-full object-cover border-4 border-[#f3f4f6]"
                  />

                ) : (

                  <div className="w-36 h-36 rounded-full bg-[#f5f5f5] flex items-center justify-center">

                    <span className="material-symbols-outlined text-[50px] text-[#9ca3af]">
                      person
                    </span>

                  </div>

                )}

              </div>


              <div className="space-y-4">

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    value={
                      ads.testimonial
                        .image
                    }
                    onChange={(event) =>
                      updateTestimonial(
                        "image",
                        event.target.value
                      )
                    }
                    placeholder="https://..."
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-xs font-bold text-[#5e6268] mb-2">
                      Name
                    </label>

                    <input
                      type="text"
                      value={
                        ads.testimonial
                          .name
                      }
                      onChange={(event) =>
                        updateTestimonial(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="ALAN DOE"
                      className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                    />

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-[#5e6268] mb-2">
                      Role
                    </label>

                    <input
                      type="text"
                      value={
                        ads.testimonial
                          .role
                      }
                      onChange={(event) =>
                        updateTestimonial(
                          "role",
                          event.target.value
                        )
                      }
                      placeholder="CEO & Founder"
                      className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                    />

                  </div>

                </div>


                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Quote
                  </label>

                  <textarea
                    value={
                      ads.testimonial
                        .quote
                    }
                    onChange={(event) =>
                      updateTestimonial(
                        "quote",
                        event.target.value
                      )
                    }
                    rows="5"
                    placeholder="Customer testimonial..."
                    className="w-full px-4 py-3 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47] resize-none"
                  />

                </div>


                <div className="flex justify-end">

                  <button
                    type="button"
                    onClick={
                      saveTestimonial
                    }
                    className="h-11 px-6 rounded-lg bg-[#ad2d47] text-white text-sm font-bold"
                  >
                    Save Testimonial
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          MID BANNER
          ========================= */}

      {activeTab === "banner" && (

        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-[#e5e7eb]">

            <h3 className="text-lg font-bold">
              Promotional Banner
            </h3>

            <p className="text-xs text-[#6b7280] mt-1">
              Manage the main promotional image and text.
            </p>

          </div>


          <div className="p-5">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div>

                {ads.mid_image.image ? (

                  <img
                    src={
                      ads.mid_image.image
                    }
                    alt={
                      ads.mid_image.title ||
                      "Promotional banner"
                    }
                    className="w-full h-[280px] object-cover rounded-xl"
                  />

                ) : (

                  <div className="w-full h-[280px] rounded-xl bg-[#f5f5f5] flex items-center justify-center">

                    <span className="material-symbols-outlined text-[55px] text-[#9ca3af]">
                      image
                    </span>

                  </div>

                )}

              </div>


              <div className="space-y-4">

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    value={
                      ads.mid_image.image
                    }
                    onChange={(event) =>
                      updateMidImage(
                        "image",
                        event.target.value
                      )
                    }
                    placeholder="https://..."
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-xs font-bold text-[#5e6268] mb-2">
                      Badge
                    </label>

                    <input
                      type="text"
                      value={
                        ads.mid_image
                          .badge
                      }
                      onChange={(event) =>
                        updateMidImage(
                          "badge",
                          event.target.value
                        )
                      }
                      placeholder="25% DISCOUNT"
                      className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                    />

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-[#5e6268] mb-2">
                      Link
                    </label>

                    <input
                      type="text"
                      value={
                        ads.mid_image
                          .link
                      }
                      onChange={(event) =>
                        updateMidImage(
                          "link",
                          event.target.value
                        )
                      }
                      placeholder="womens-fashion"
                      className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                    />

                  </div>

                </div>


                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Title
                  </label>

                  <input
                    type="text"
                    value={
                      ads.mid_image.title
                    }
                    onChange={(event) =>
                      updateMidImage(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Summer Collection"
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>


                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Subtitle
                  </label>

                  <input
                    type="text"
                    value={
                      ads.mid_image
                        .subtitle
                    }
                    onChange={(event) =>
                      updateMidImage(
                        "subtitle",
                        event.target.value
                      )
                    }
                    placeholder="Starting @ $10"
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>


                <div className="flex justify-end">

                  <button
                    type="button"
                    onClick={
                      saveMidImage
                    }
                    className="h-11 px-6 rounded-lg bg-[#ad2d47] text-white text-sm font-bold"
                  >
                    Save Banner
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          AD CARDS
          ========================= */}

      {activeTab === "ads" && (

        <>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

              <div>

                <h3 className="text-lg font-bold">
                  Advertisement Cards
                </h3>

                <p className="text-xs text-[#6b7280] mt-1">
                  Manage promotional cards displayed across the store.
                </p>

              </div>


              <button
                type="button"
                onClick={openAddAd}
                className="h-11 px-5 rounded-lg bg-[#ad2d47] text-white text-sm font-bold flex items-center justify-center gap-2"
              >

                <span className="material-symbols-outlined text-[19px]">
                  add
                </span>

                Add Advertisement

              </button>

            </div>

          </div>


          {ads.ad_images.length ===
          0 ? (

            <div className="bg-white border border-[#e5e7eb] rounded-xl py-16 text-center">

              <span className="material-symbols-outlined text-[50px] text-[#c4c7ca]">
                campaign
              </span>

              <p className="mt-3 font-bold text-[#5e6268]">
                No advertisements found
              </p>

            </div>

          ) : (

            <>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              {ads.ad_images
                .slice((adsPage - 1) * ADS_PER_PAGE, adsPage * ADS_PER_PAGE)
                .map(
                (ad, index) => {
                  const actualIndex =
                    (adsPage - 1) * ADS_PER_PAGE + index;

                  return (

                  <div
                    key={index}
                    className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden"
                  >

                    <div className="relative">

                      <img
                        src={ad.image}
                        alt={
                          ad.title ||
                          "Advertisement"
                        }
                        className="w-full h-[210px] object-cover"
                      />

                      <div className="absolute top-3 right-3 flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditAd(
                              actualIndex
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
                            deleteAd(
                              actualIndex
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


                    <div className="p-4">

                      <p className="text-xs font-bold uppercase tracking-wider text-[#ad2d47]">
                        {ad.category}
                      </p>

                      <h4 className="font-bold mt-2">
                        {ad.title}
                      </h4>

                      <p className="text-xs text-[#6b7280] mt-2 break-all">
                        Link:{" "}
                        {ad.link ||
                          "—"}
                      </p>

                    </div>

                  </div>

                  );
                }
              )}

            </div>

            {ads.ad_images.length > ADS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white border border-[#e5e7eb] rounded-xl p-4">
                <p className="text-xs text-[#6b7280] font-semibold">
                  Showing {(adsPage - 1) * ADS_PER_PAGE + 1} to {Math.min(adsPage * ADS_PER_PAGE, ads.ad_images.length)} of {ads.ad_images.length} advertisements
                </p>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button type="button" disabled={adsPage === 1} onClick={() => setAdsPage((page) => Math.max(1, page - 1))} className="h-9 px-3 rounded-lg border border-[#dfe2e5] text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f5]">Previous</button>
                  {Array.from({ length: Math.ceil(ads.ad_images.length / ADS_PER_PAGE) }, (_, index) => index + 1).map((page) => (
                    <button key={page} type="button" onClick={() => setAdsPage(page)} className={`w-9 h-9 rounded-lg text-xs font-bold ${adsPage === page ? "bg-[#ad2d47] text-white" : "border border-[#dfe2e5] text-[#5e6268] hover:bg-[#f5f5f5]"}`}>{page}</button>
                  ))}
                  <button type="button" disabled={adsPage === Math.ceil(ads.ad_images.length / ADS_PER_PAGE)} onClick={() => setAdsPage((page) => Math.min(Math.ceil(ads.ad_images.length / ADS_PER_PAGE), page + 1))} className="h-9 px-3 rounded-lg border border-[#dfe2e5] text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f5]">Next</button>
                </div>
              </div>
            )}

            </>

          )}

        </>
      )}


      {/* =========================
          ADD / EDIT AD MODAL
          ========================= */}

      {showAdForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close"
            onClick={closeAdForm}
            className="absolute inset-0 bg-black/40 cursor-default"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">

            <div className="border-b border-[#e5e7eb] px-5 py-4 flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Advertisement
                </p>

                <h3 className="text-xl font-extrabold mt-1">
                  {editingAdIndex !== null
                    ? "Edit Advertisement"
                    : "Add Advertisement"}
                </h3>

              </div>


              <button
                type="button"
                onClick={closeAdForm}
                className="w-9 h-9 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>


            <form
              onSubmit={saveAd}
              className="p-5 space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-[#5e6268] mb-2">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={adForm.image}
                  onChange={handleAdChange}
                  required
                  placeholder="https://..."
                  className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                />

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={
                      adForm.category
                    }
                    onChange={
                      handleAdChange
                    }
                    placeholder="Fashion"
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>


                <div>

                  <label className="block text-xs font-bold text-[#5e6268] mb-2">
                    Link
                  </label>

                  <input
                    type="text"
                    name="link"
                    value={adForm.link}
                    onChange={
                      handleAdChange
                    }
                    placeholder="mens-fashion"
                    className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                  />

                </div>

              </div>


              <div>

                <label className="block text-xs font-bold text-[#5e6268] mb-2">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={adForm.title}
                  onChange={
                    handleAdChange
                  }
                  required
                  placeholder="Trending Styles in 2026"
                  className="w-full h-11 px-4 rounded-lg border border-[#dfe2e5] outline-none focus:border-[#ad2d47]"
                />

              </div>


              <div className="pt-3 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeAdForm}
                  className="h-11 px-5 rounded-lg border border-[#dfe2e5] text-sm font-bold text-[#5e6268]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-11 px-6 rounded-lg bg-[#ad2d47] text-white text-sm font-bold"
                >
                  {editingAdIndex !== null
                    ? "Update Advertisement"
                    : "Add Advertisement"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Ads;