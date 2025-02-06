/**
 * Main application component.
 *
 * - Defines routes using React Router.
 * - Includes common components like the Menu.
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
// import Users from "./pages/Users";
// import Profile from "./pages/Profile";
// import EditProfile from "./pages/EditProfile";
import Menu from "./components/Menu";

const App: React.FC = () => {
  return (
    <>
      {/* Navigation Menu */}
      <Menu />

      {/* Define application routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        {/* <Route path="/users" element={<Users />} /> */}
        {/* <Route path="/profile/:id" element={<Profile />} /> */}
        {/* <Route path="/profile/edit" element={<EditProfile />} /> */}
      </Routes>
    </>
  );
};

export default App;
