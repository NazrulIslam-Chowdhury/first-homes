import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { ListingCard } from "../components";
import { FaLongArrowAltRight } from "react-icons/fa";
import logo from "../assets/first-homes-high-resolution-logo-transparent.png";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl uppercase">
          Find your next{" "}
          <span className="text-[#AECF75] tracking-widest">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm uppercase">
          First Homes is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm bg-[#AECF75] text-white font-bold py-4 px-10 mr-auto uppercase rounded-lg hover:bg-[#8fbb43] hover:transition-all hover:scale-110 hover:duration-300 duration-300"
        >
          <div className="flex items-center gap-4">
            <p>get started</p>
            <FaLongArrowAltRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* swiper */}
      <Swiper
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active",
          bulletClass: "swiper-pagination-bullet",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="flex justify-center py-40 bg-slate-500">
        <img src={logo} alt="first homes" className="w-64" loading="lazy" />
      </div>
      {/* listing results for offer, sale and rent */}
      <div className="max-w-full ml-auto sm:ml-5 p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="space-y-10">
            <div className="my-3 space-y-5">
              <h2 className="text-4xl text-[#AECF75] tracking-wider font-semibold uppercase">
                Recent offers
              </h2>
              <Link
                className="text-xs sm:text-sm max-w-[16rem] bg-[#AECF75] text-white font-bold py-4 px-10 mr-auto uppercase rounded-lg hover:bg-[#8fbb43] hover:transition-all hover:scale-110 hover:duration-300 duration-300 flex items-center gap-4"
                to={"/search?offer=true"}
              >
                <p>Show More offers</p>
                <FaLongArrowAltRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="space-y-10">
            <div className="my-3 space-y-5">
              <h2 className="text-4xl text-[#AECF75] tracking-wider font-semibold uppercase">
                Recent places for rent
              </h2>
              <Link
                className="text-xs sm:text-sm max-w-[22rem] bg-[#AECF75] text-white font-bold py-4 px-10 mr-auto uppercase rounded-lg hover:bg-[#8fbb43] hover:transition-all hover:scale-110 hover:duration-300 duration-300 flex items-center gap-4"
                to={"/search?type=rent"}
              >
                <p>Show more places for rent</p>
                <FaLongArrowAltRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="space-y-10">
            <div className="my-3 space-y-5">
              <h2 className="text-4xl text-[#AECF75] tracking-wider font-semibold uppercase">
                Recent places for sale
              </h2>
              <Link
                className="text-xs sm:text-sm max-w-[22rem] bg-[#AECF75] text-white font-bold py-4 px-10 mr-auto uppercase rounded-lg hover:bg-[#8fbb43] hover:transition-all hover:scale-110 hover:duration-300 duration-300 flex items-center gap-4"
                to={"/search?type=sale"}
              >
                <p>Show more places for sale</p>
                <FaLongArrowAltRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
