import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
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
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">First</span>
          <span className="text-slate-700">Homes</span>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 px-5 py-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none caret-slate-500 w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden sm:inline text-slate-700 hover:underline cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hidden sm:inline text-slate-700 hover:underline cursor-pointer"
          >
            About
          </Link>

          <Link to="/profile" className=" cursor-pointer">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-8 w-8 object-cover"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
