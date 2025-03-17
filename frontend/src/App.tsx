import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ViewProfilePage from "./pages/ViewProfilePage";
import EditUserPage from './pages/EditUserPage';
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile/:userId" element={<ViewProfilePage />} />
              <Route path="/profile/edit/:userId" element={<EditUserPage />} />
            </Route>
            {/* <Route path="/signup" element={<SignUp />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
