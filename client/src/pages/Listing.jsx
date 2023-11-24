import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListings(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading....</p>}
      {error && (
        <p className="text-center my-7 text-2xl text-red-700 font-semibold">
          Something went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper
            navigation
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Navigation]}
          >
            {listing.imgUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="w-full h-[550px] object-cover"
                  style={{
                    background: `url(${image}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer hover:scale-110 transition-transform duration-300">
            <FaShare
              className="text-slate-500 "
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 50000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[21%] right-[5%] z-10 rounded-md bg-green-200 p-2 text-gray-700 before:bg-green-200 before:w-4 before:h-4 before:absolute before:-top-1 before:right-[3px] before:rounded-tl-lg before:rotate-[140deg] font-semibold">
              Link copied!
            </p>
          )}
        </>
      )}
    </main>
  );
};

export default Listing;
