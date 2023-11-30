import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  About,
  CreateListing,
  Home,
  Listing,
  Profile,
  Search,
  SignIn,
  SignUp,
  UpdateListing,
} from "./pages";
import { Toaster } from "react-hot-toast";
import { Header, PrivateRoute } from "./components";

function App() {
  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
