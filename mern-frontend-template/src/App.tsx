/**
 * Main application component.
 *
 * - Defines routes using React Router.
 * - Includes common components like the Menu.
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import SignUp from "./pages/SignUp";
// import SignIn from "./pages/SignIn";
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
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* <Route path="/signin" element={<SignIn />} /> */}
        {/* <Route path="/users" element={<Users />} /> */}
        {/* <Route path="/profile/:id" element={<Profile />} /> */}
        {/* <Route path="/profile/edit" element={<EditProfile />} /> */}
      </Routes>
    </>
  );
};

export default App;
