import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        setUserData(userDoc.data());

        // Fetch user listings
        const listingsQuery = query(
          collection(db, 'products'),
          where('userId', '==', auth.currentUser.uid)
        );
        const listingsSnapshot = await getDocs(listingsQuery);
        setListings(listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch user orders (placeholder until orders implementation)
        setOrders([]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{userData?.displayName || 'User'}</h1>
            <p className="text-gray-600">{userData?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(userData?.createdAt?.toDate()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['profile', 'listings', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <p className="mt-1 text-gray-900">{userData?.displayName || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{userData?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-gray-900">{userData?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
                <Link
                  to="/add-product"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  List Your First Item
                </Link>
              </div>
            ) : (
              listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/product/${listing.id}`} className="block">
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {listing.images?.[0] && (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-purple-700 font-bold">${listing.price}</span>
                        {listing.rentalPrice && (
                          <span className="text-gray-500 text-sm ml-2">/ ${listing.rentalPrice} to rent</span>
                        )}
                      </div>
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">{listing.condition}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't made any purchases yet</p>
                <Link
                  to="/search"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Browse Items
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Order items would go here */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
