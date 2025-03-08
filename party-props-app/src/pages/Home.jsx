import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularThemes, setPopularThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder themes until we have real data
  const themes = [
    { id: 1, name: 'Cowboys & Cowgirls', image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&auto=format' },
    { id: 2, name: 'Hollywood Glamour', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&auto=format' },
    { id: 3, name: 'Superhero', image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&auto=format' },
    { id: 4, name: '80s Retro', image: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&auto=format' },
    { id: 5, name: 'Halloween', image: 'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&auto=format' },
    { id: 6, name: 'Masquerade Ball', image: 'https://images.unsplash.com/photo-1577640905050-83665369bebf?q=80&auto=format' },
  ];

  useEffect(() => {
    setPopularThemes(themes);
    
    const fetchFeaturedItems = async () => {
      try {
        // In a real app, we'd fetch featured items from Firestore
        // For now, we'll use placeholder data
        const placeholderItems = [
          { 
            id: '1', 
            title: 'Cowboy Hat', 
            description: 'Authentic-looking cowboy hat, perfect for western themed parties',
            price: 25, 
            rentalPrice: 10,
            image: 'https://images.unsplash.com/photo-1561730916-2f8e6f3d0e01?q=80&auto=format',
            category: 'props',
            condition: 'Like New'
          },
          { 
            id: '2', 
            title: 'Superhero Cape', 
            description: 'Red cape for your superhero costume needs',
            price: 15, 
            rentalPrice: 5,
            image: 'https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&auto=format',
            category: 'costumes',
            condition: 'Good'
          },
          { 
            id: '3', 
            title: 'Disco Ball', 
            description: 'Light up your 70s disco party with this authentic disco ball',
            price: 35, 
            rentalPrice: 15,
            image: 'https://images.unsplash.com/photo-1558180702-95f1c3ae2ca3?q=80&auto=format',
            category: 'decorations',
            condition: 'Excellent'
          },
          { 
            id: '4', 
            title: 'Pirate Costume Set', 
            description: 'Complete pirate costume including hat, eye patch, and sword',
            price: 45, 
            rentalPrice: 20,
            image: 'https://images.unsplash.com/photo-1635013993232-59aeca3effaa?q=80&auto=format',
            category: 'costumes',
            condition: 'Like New'
          },
        ];

        setFeaturedItems(placeholderItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured items:', error);
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the Perfect Outfit for Your Next Party</h1>
          <p className="text-xl mb-8">Buy or rent unique costumes, props, and accessories from people in your community</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold">
              Browse Items
            </Link>
            <Link to="/add-product" className="bg-transparent hover:bg-white hover:text-purple-700 text-white border-2 border-white px-6 py-3 rounded-lg font-semibold">
              Sell Your Items
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Items</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/product/${item.id}`}>
                    <div className="h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.description.substring(0, 60)}...</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-purple-700 font-bold">${item.price}</span>
                          {item.rentalPrice && (
                            <span className="text-gray-500 text-sm ml-2">/ ${item.rentalPrice} to rent</span>
                          )}
                        </div>
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded">{item.condition}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/search" className="text-purple-700 font-semibold hover:text-purple-900 inline-flex items-center">
              View All Items
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Themes */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Party Themes</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularThemes.map((theme) => (
              <Link 
                key={theme.id} 
                to={`/search?theme=${encodeURIComponent(theme.name)}`}
                className="block relative rounded-lg overflow-hidden group"
              >
                <div className="h-64 w-full">
                  <img 
                    src={theme.image} 
                    alt={theme.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white text-xl font-bold p-4">{theme.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find What You Need</h3>
              <p className="text-gray-600">Search for props, costumes, and accessories by theme, category, or keyword.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Buy or Rent</h3>
              <p className="text-gray-600">Choose to buy the item or rent it for your event, saving money and space.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">Earn money by selling or renting out your party items after you're done with them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Party Look?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join our community of party enthusiasts who buy, sell, and rent unique party items</p>
          <Link to="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold text-lg">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
