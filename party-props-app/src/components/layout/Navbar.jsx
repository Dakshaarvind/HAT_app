import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

const Navbar = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Party Props
          </Link>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search costumes, props..."
                className="px-4 py-2 rounded-l-lg text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-r-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <div className="relative group">
              <button className="hover:text-yellow-300 flex items-center">
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <Link to="/search?category=costumes" className="block px-4 py-2 hover:bg-purple-100">Costumes</Link>
                <Link to="/search?category=props" className="block px-4 py-2 hover:bg-purple-100">Props</Link>
                <Link to="/search?category=accessories" className="block px-4 py-2 hover:bg-purple-100">Accessories</Link>
                <Link to="/search?category=decorations" className="block px-4 py-2 hover:bg-purple-100">Decorations</Link>
              </div>
            </div>
            {user ? (
              <>
                <Link to="/add-product" className="hover:text-yellow-300">Sell Item</Link>
                <div className="relative group">
                  <button className="hover:text-yellow-300 flex items-center">
                    Account
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-purple-100">My Profile</Link>
                    <Link to="/profile/listings" className="block px-4 py-2 hover:bg-purple-100">My Listings</Link>
                    <Link to="/profile/orders" className="block px-4 py-2 hover:bg-purple-100">My Orders</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-purple-100">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-yellow-300">Login</Link>
                <Link to="/signup" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-4 flex">
              <input
                type="text"
                placeholder="Search costumes, props..."
                className="flex-grow px-4 py-2 rounded-l-lg text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-r-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-yellow-300">Home</Link>
              <div className="relative">
                <details className="group">
                  <summary className="list-none flex justify-between items-center cursor-pointer">
                    <span>Categories</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-2 space-y-2 pl-4">
                    <Link to="/search?category=costumes" className="block hover:text-yellow-300">Costumes</Link>
                    <Link to="/search?category=props" className="block hover:text-yellow-300">Props</Link>
                    <Link to="/search?category=accessories" className="block hover:text-yellow-300">Accessories</Link>
                    <Link to="/search?category=decorations" className="block hover:text-yellow-300">Decorations</Link>
                  </div>
                </details>
              </div>
              {user ? (
                <>
                  <Link to="/add-product" className="hover:text-yellow-300">Sell Item</Link>
                  <div className="relative">
                    <details className="group">
                      <summary className="list-none flex justify-between items-center cursor-pointer">
                        <span>Account</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-2 space-y-2 pl-4">
                        <Link to="/profile" className="block hover:text-yellow-300">My Profile</Link>
                        <Link to="/profile/listings" className="block hover:text-yellow-300">My Listings</Link>
                        <Link to="/profile/orders" className="block hover:text-yellow-300">My Orders</Link>
                        <button onClick={handleLogout} className="block w-full text-left hover:text-yellow-300">Logout</button>
                      </div>
                    </details>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-yellow-300">Login</Link>
                  <Link to="/signup" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
