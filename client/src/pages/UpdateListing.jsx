import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imgUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadErr, setImageUploadErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  //   get user list
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  // hosting img to firebase
  const handleImgUpload = async () => {
    if (files.length > 0 && files.length + formData.imgUrls.length < 7) {
      setUploading(true);
      setImageUploadErr(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imgUrls: formData.imgUrls.concat(urls),
          });
          setImageUploadErr(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadErr("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadErr("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadImage = uploadBytesResumable(storageRef, file);
      uploadImage.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // delete image
  const handleDeleteImg = (index) => {
    setFormData({
      ...formData,
      imgUrls: formData.imgUrls.filter((_, i) => i !== index),
    });
  };

  // handle form input info
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  // fetch api for updating listing in the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imgUrls.length < 1)
        return setError("You must upload at least 1 image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      toast.success("List updated successfully");
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg outline-lime-400"
            id="name"
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg outline-lime-400"
            id="description"
            rows="5"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg outline-lime-400"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap mt-5 accent-lime-400">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-7 h-7 appearance-none bg-white border-2 relative align-middle inline-block rounded-full transition-all ease-in-out duration-[0.4s] overflow-hidden  before:content-['\2713'] before:text-white before:absolute before:font-bold before:leading-5 before:right-2 before:scale-0 before:transition-all before:ease-in-out before:duration-[0.4s] before:checked:scale-[120%] checked:bg-lime-400 cursor-pointer"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-7 h-7 appearance-none bg-white border-2 relative align-middle inline-block rounded-full transition-all ease-in-out duration-[0.4s] overflow-hidden  before:content-['\2713'] before:text-white before:absolute before:font-bold before:leading-5 before:right-2 before:scale-0 before:transition-all before:ease-in-out before:duration-[0.4s] before:checked:scale-[120%] checked:bg-lime-400 cursor-pointer"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-7 h-7 appearance-none bg-white border-2 relative align-middle inline-block rounded-full transition-all ease-in-out duration-[0.4s] overflow-hidden  before:content-['\2713'] before:text-white before:absolute before:font-bold before:leading-5 before:right-2 before:scale-0 before:transition-all before:ease-in-out before:duration-[0.4s] before:checked:scale-[120%] checked:bg-lime-400 cursor-pointer"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-7 h-7 appearance-none bg-white border-2 relative align-middle inline-block rounded-full transition-all ease-in-out duration-[0.4s] overflow-hidden  before:content-['\2713'] before:text-white before:absolute before:font-bold before:leading-5 before:right-2 before:scale-0 before:transition-all before:ease-in-out before:duration-[0.4s] before:checked:scale-[120%] checked:bg-lime-400 cursor-pointer"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-7 h-7 appearance-none bg-white border-2 relative align-middle inline-block rounded-full transition-all ease-in-out duration-[0.4s] overflow-hidden  before:content-['\2713'] before:text-white before:absolute before:font-bold before:leading-5 before:right-2 before:scale-0 before:transition-all before:ease-in-out before:duration-[0.4s] before:checked:scale-[120%] checked:bg-lime-400 cursor-pointer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-5">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg outline-lime-400"
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-gray-300 rounded-lg outline-lime-400"
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg outline-lime-400"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 rounded-lg outline-lime-400"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-sm">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              className="p-3 border border-gary-300 rounded w-full cursor-pointer"
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              className="p-3 text-white font-semibold border bg-[#AECF75] rounded uppercase hover:shadow-lg hover:bg-[#9ec45b] disabled:opacity-80"
              onClick={handleImgUpload}
            >
              {uploading ? "uploading...." : "upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadErr && imageUploadErr}</p>
          {formData.imgUrls.length > 0 &&
            formData.imgUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="text-white text-sm py-1 px-5 bg-red-800 hover:bg-red-700 transition-colors duration-300 font-semibold uppercase rounded-lg"
                  onClick={() => handleDeleteImg(index)}
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating...." : "Update listing"}
          </button>
          {error && <p className="text-red-700 font-semibold">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
