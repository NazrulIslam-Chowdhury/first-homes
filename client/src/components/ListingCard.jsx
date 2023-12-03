import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed } from "react-icons/fa";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-[#d6dfcc] hover:bg-[#a5d073] hover:bg-opacity-75 hover:duration-500 duration-500 shadow-lg hover:shadow-xl transition-all overflow-hidden rounded-lg w-[30rem] relative">
      <Link
        to={`/listing/${listing._id}`}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="w-[26rem] h-[20rem] overflow-hidden">
          <img
            src={listing.imgUrls && listing.imgUrls[0]}
            alt="listing cover"
            className="h-[320px] sm:h-full w-full object-cover hover:scale-105 transition-scale duration-300"
          />
        </div>
        <div className="p-3 flex flex-col gap-2 w-full">
          <h2 className="text-lg font-semibold text-[#9ac64d] truncate uppercase">
            {listing.name}
          </h2>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-700 h-4 w-4" />
            <p className="text-sm text-slate-500 truncate uppercase">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-500 line-clamp-3">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            ${" "}
            {(+listing.regularPrice - +listing.discountPrice).toLocaleString(
              "en-US"
            )}
            {listing.type === "rent" && " (Month)"}
          </p>
          <div className="text-slate-600 flex gap-4">
            <div className="font-bold text-xs flex gap-2 items-center uppercase">
              <FaBed className="w-5 h-5" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs flex gap-2 items-center uppercase">
              <FaBath className="w-4 h-4" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>

        <p
          className={`absolute bottom-2 right-2 ${
            listing.type === "sale" ? "bg-red-600" : "bg-teal-600"
          } py-1 px-3 rounded-lg text-white font-semibold uppercase text-sm`}
        >
          {listing.type === "rent" ? "rent" : "sale"}
        </p>
      </Link>
    </div>
  );
};

export default ListingCard;
