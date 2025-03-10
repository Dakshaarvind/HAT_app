import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase/config';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      // Only attempt to use Firebase auth if it's properly configured
      if (isFirebaseConfigured) {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }, (error) => {
          console.error("Auth state change error:", error);
          setAuthError(error.message);
          setLoading(false);
        });
      } else {
        // If Firebase isn't configured, don't wait for auth
        console.warn("Firebase auth not configured, proceeding without authentication");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setAuthError("Authentication service coming soon");
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Show a banner if auth service is unavailable but allow app to function
  const AuthServiceBanner = () => {
    if (!isFirebaseConfigured || authError) {
      return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Authentication Service Coming Soon</p>
          <p>User accounts and personalized features are currently unavailable. You can still browse products.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AuthServiceBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
