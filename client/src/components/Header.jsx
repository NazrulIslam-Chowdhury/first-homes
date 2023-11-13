import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">First</span>
          <span className="text-slate-700">Homes</span>
        </Link>
        <form className="bg-slate-100 px-5 py-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none caret-slate-500 w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
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
          <Link
            to="/sign-in"
            className=" text-slate-700 hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
