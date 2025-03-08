import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Party Props</h3>
            <p className="mb-4">
              The #1 marketplace for party costumes, props, and accessories. Buy, sell, or rent items for your next themed event!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.97.19c-.7-.69-1.39-1.03-2.1-1.03-1.05 0-1.92.84-1.92 1.92 0 .75.44 1.22 1.08 1.55-.3.36-.66.89-.66 1.32 0 .37.27.69.64.92-.36.45-.57.96-.57 1.5 0 1.22 1.05 2.05 2.53 2.05 1.17 0 2.22-.63 2.22-1.73 0-.81-.45-1.33-1.45-1.67-.35-.12-.53-.36-.53-.69 0-.16.08-.32.24-.44.54.21 1.14.32 1.77.32.64 0 1.23-.1 1.75-.31.28.33.67.5 1.19.5.53 0 .99-.24 1.32-.66l-1.29-.49c-.15.16-.32.25-.53.25-.21 0-.38-.09-.53-.25l1.29-.51c-.15-.16-.32-.25-.53-.25-.21 0-.38.09-.53.25l1.29-.51c-.18-.35-.51-.57-.85-.57-.33 0-.65.21-.84.55l-1.35-.53c.19-.15.31-.36.31-.61 0-.32-.21-.57-.64-.57-.36 0-.68.1-.91.31l.47 1.43c.18-.21.45-.33.74-.33.16 0 .32.03.45.09l-.21.67h.01z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-purple-400">Home</Link></li>
              <li><Link to="/search?category=costumes" className="hover:text-purple-400">Costumes</Link></li>
              <li><Link to="/search?category=props" className="hover:text-purple-400">Props</Link></li>
              <li><Link to="/search?category=accessories" className="hover:text-purple-400">Accessories</Link></li>
              <li><Link to="/search?category=decorations" className="hover:text-purple-400">Decorations</Link></li>
            </ul>
          </div>
          
          {/* Account */}
          <div>
            <h3 className="text-xl font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-purple-400">Login</Link></li>
              <li><Link to="/signup" className="hover:text-purple-400">Sign Up</Link></li>
              <li><Link to="/profile" className="hover:text-purple-400">My Profile</Link></li>
              <li><Link to="/profile/listings" className="hover:text-purple-400">My Listings</Link></li>
              <li><Link to="/profile/orders" className="hover:text-purple-400">My Orders</Link></li>
            </ul>
          </div>
          
          {/* Help & Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-purple-400">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-purple-400">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-purple-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Party Props. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
