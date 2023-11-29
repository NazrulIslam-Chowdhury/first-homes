import { FaSearch } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSideNav, setSideNav] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    if (searchTerm) {
      setSearchTerm(searchTerm);
    }
  }, []);
  return (
    <header className="bg-[#d6dfcc] shadow-md sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"} className="font-bold text-sm sm:text-xl flex flex-wrap">
          <img
            src="/src/assets/first-homes-high-resolution-logo-transparent.png"
            alt="logo"
            className="w-28 sm:w-40 h-10"
          />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 px-5 py-3 rounded-lg flex items-center"
        >
          <div>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none caret-slate-500 w-24 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className="text-[#AECF75]" />
            </button>
          </div>
        </form>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden sm:inline text-white font-semibold hover:bg-[#AECF75] hover:py-2 hover:px-5 px-5 hover:transition-all duration-300 hover:bg-opacity-75 hover:rounded-lg cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hidden sm:inline text-white font-semibold hover:bg-[#AECF75] hover:py-2 hover:px-5 px-5 hover:transition-all duration-300 hover:bg-opacity-75 hover:rounded-lg cursor-pointer"
          >
            About
          </Link>

          <Link to="/profile" className=" cursor-pointer">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-8 w-8 object-cover hidden sm:flex"
              />
            ) : (
              <li className="text-white font-semibold hover:bg-[#AECF75] hover:py-2 hover:px-5 px-5 hover:transition-all duration-300 hover:bg-opacity-75 hover:rounded-lg">
                Sign in
              </li>
            )}
          </Link>

          {/*mobile nav sidebar */}
          <div>
            <CiMenuFries
              className="sm:hidden flex w-6 h-6 cursor-pointer"
              onClick={() => setSideNav(true)}
            />
            <div
              className={`${
                openSideNav && "opacity-100 mr-[0vw]"
              } bg-[#d6dfcc] h-screen w-auto absolute block sm:hidden right-0 top-0 -mr-[48vw] opacity-0 p-10 ease-in-out duration-[0.5s] transition-all`}
            >
              <button
                onClick={() => setSideNav(false)}
                className="float-right w-10"
              >
                X
              </button>

              <ul className="flex flex-col gap-10 mt-20">
                <Link
                  to="/"
                  className=" text-white font-semibold hover:bg-[#AECF75] hover:py-2 hover:px-5 px-5 hover:transition-all duration-300 hover:bg-opacity-75 hover:rounded-lg cursor-pointer"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className=" text-white font-semibold hover:bg-[#AECF75] hover:py-2 hover:px-5 px-5 hover:transition-all duration-300 hover:bg-opacity-75 hover:rounded-lg cursor-pointer"
                >
                  About
                </Link>

                <Link to="/profile" className="cursor-pointer ml-4">
                  {currentUser ? (
                    <img
                      src={currentUser.avatar}
                      alt="profile"
                      className="rounded-full h-8 w-8 object-cover"
                    />
                  ) : (
                    <li className="text-white font-semibold hover:bg-[#AECF75] hover:py-2 hover:px-5 px-5 hover:transition-all duration-300 hover:bg-opacity-75 hover:rounded-lg">
                      Sign in
                    </li>
                  )}
                </Link>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
