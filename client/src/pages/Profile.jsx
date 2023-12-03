import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logOutUserFailure,
  logOutUserStart,
  logOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [showPass, setShowPass] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // update user
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(deleteUserFailure(data.message));
      }

      dispatch(deleteUserSuccess(data));
      toast.success("User deleted");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // logging out user
  const handleLogOut = async () => {
    try {
      dispatch(logOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data === false) {
        dispatch(logOutUserFailure(data.message));
        return;
      }
      dispatch(logOutUserSuccess(data));
      toast.success("Logged out");
    } catch (error) {
      dispatch(logOutUserFailure(error.message));
    }
  };

  // upload file to firebase storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; // to get unique file from user
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // file upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  // firebase storage
  // allow read;
  //       allow write: if
  //       request.resource.size < 2 * 1024 * 1024 &&
  //       request.resource.contentType.matches('image/.*')

  // show listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // delete listing
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 uppercase">
        Profile
      </h1>
      <form
        className="flex flex-col gap-4 relative bg-[#cddcbc] p-7 mt-20 rounded-lg"
        onSubmit={handleSubmit}
      >
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 absolute -top-16 border-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center font-semibold">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (Image must be less than 2mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePercentage}%`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">
              Image Successfully uploaded !
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="mt-10 flex flex-col gap-5">
          <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg outline-lime-400"
            id="userName"
            defaultValue={currentUser.userName}
            onChange={handleOnChange}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg outline-lime-400"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleOnChange}
          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="password"
              className="border p-3 rounded-lg w-full outline-lime-400"
              id="password"
              onChange={handleOnChange}
            />
            <div className="absolute right-4 top-4 cursor-pointer">
              {!showPass ? (
                <FaRegEye onClick={() => setShowPass(!showPass)} />
              ) : (
                <FaRegEyeSlash onClick={() => setShowPass(!showPass)} />
              )}
            </div>
          </div>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "updating...." : "update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer font-semibold"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer font-semibold"
          onClick={handleLogOut}
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5 font-semibold">{error ? error : ""}</p>

      <div>
        <button
          onClick={handleShowListings}
          className="text-green-700 w-full text-center font-semibold"
        >
          Show listings
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings or sign in again" : ""}
        </p>
      </div>

      <div className="space-y-5">
        <h1 className="font-semibold text-center text-sm uppercase">
          {userListings?.length > 0 && "Your listings"}
        </h1>
        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imgUrls[0]}
                  alt="listing cover"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col gap-3 items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-white text-sm py-1 px-5 bg-red-600 hover:bg-red-800 transition-colors duration-300 font-semibold uppercase rounded-lg"
                >
                  delete
                </button>
                <Link
                  to={`/update-listing/${listing._id}`}
                  className=" bg-teal-600 hover:bg-teal-800 transition-colors duration-300  rounded-lg"
                >
                  <button className="uppercase font-semibold text-white text-sm text-center  py-1 px-5">
                    edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
