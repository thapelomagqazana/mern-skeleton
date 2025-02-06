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
import UsersListPage from "./pages/UsersListPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import DashboardPage from "./pages/DashboardPage";
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
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/profile/:userId" element={<ViewProfilePage />} />
        <Route path="/profile/edit/:userId" element={<EditProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
};

export default App;
