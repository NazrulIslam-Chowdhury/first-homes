import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  About,
  CreateListing,
  Home,
  Profile,
  SignIn,
  SignUp,
  UpdateListing,
} from "./pages";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
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
  );
}

export default App;
