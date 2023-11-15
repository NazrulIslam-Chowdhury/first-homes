import { useState } from "react";
import { useSelector } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="userName"
        />
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="email"
        />
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="password"
            className="border p-3 rounded-lg w-full"
            id="password"
          />
          <div className="absolute right-4 top-4 cursor-pointer">
            {!showPass ? (
              <FaRegEye onClick={() => setShowPass(!showPass)} />
            ) : (
              <FaRegEyeSlash onClick={() => setShowPass(!showPass)} />
            )}
          </div>
        </div>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
