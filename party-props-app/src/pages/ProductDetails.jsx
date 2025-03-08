import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { loadStripe } from '@stripe/stripe-js';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseType, setPurchaseType] = useState('buy'); // 'buy' or 'rent'
  const [similarItems, setSimilarItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // In a real app, we'd fetch the product from Firestore
        // For now, we'll use placeholder data
        
        // Simulated product data
        const mockProduct = {
          id: id,
          title: 'Cowboy Hat',
          description: 'Authentic-looking cowboy hat, perfect for western themed parties. Made with high-quality materials for a realistic look and feel. This hat has been worn once for a themed party and is in excellent condition.',
          price: 25,
          rentalPrice: 10,
          rentalDuration: '3 days',
          condition: 'Like New',
          category: 'props',
          theme: 'Western',
          images: [
            'https://images.unsplash.com/photo-1561730916-2f8e6f3d0e01?q=80&auto=format',
            'https://images.unsplash.com/photo-1610628529326-5ec9bc8eed7d?q=80&auto=format'
          ],
          seller: {
            id: 'user123',
            name: 'John Doe',
            rating: 4.8,
            reviewCount: 23
          },
          createdAt: new Date().toISOString(),
          location: 'San Francisco, CA'
        };

        setProduct(mockProduct);
        
        // Fetch similar items
        // In a real app, we'd fetch similar items from Firestore
        const mockSimilarItems = [
          { 
            id: '2', 
            title: 'Western Boots', 
            price: 45, 
            rentalPrice: 20,
            image: 'https://images.unsplash.com/photo-1623113562225-694f6a2ee75e?q=80&auto=format',
            condition: 'Good'
          },
          { 
            id: '3', 
            title: 'Sheriff Badge', 
            price: 12, 
            rentalPrice: 5,
            image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&auto=format',
            condition: 'Excellent'
          },
          { 
            id: '4', 
            title: 'Western Vest', 
            price: 30, 
            rentalPrice: 15,
            image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&auto=format',
            condition: 'Like New'
          },
        ];
        
        setSimilarItems(mockSimilarItems);
        
        // Fetch recommendations
        const mockRecommendations = [
          { 
            id: '5', 
            title: 'Cowboy Gloves', 
            price: 20, 
            rentalPrice: 10,
            image: 'https://images.unsplash.com/photo-1623113562225-694f6a2ee75e?q=80&auto=format',
            condition: 'Good'
          },
          { 
            id: '6', 
            title: 'Western Belt', 
            price: 15, 
            rentalPrice: 5,
            image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&auto=format',
            condition: 'Excellent'
          },
          { 
            id: '7', 
            title: 'Cowboy Hat Band', 
            price: 10, 
            rentalPrice: 5,
            image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&auto=format',
            condition: 'Like New'
          },
        ];
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    // In a real app, we'd add the item to the cart in a state management system
    // or localStorage, then navigate to checkout
    navigate('/checkout', { 
      state: { 
        items: [{ 
          id: product.id,
          title: product.title,
          price: purchaseType === 'buy' ? product.price : product.rentalPrice,
          purchaseType: purchaseType,
          image: product.images[0]
        }] 
      } 
    });
  };

  const handleContactSeller = () => {
    // In a real app, we'd implement a messaging system
    alert('Messaging system would open here to contact the seller.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-700">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="relative h-96">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex p-2 space-x-2 bg-gray-100">
                {product.images.map((img, i) => (
                  <div key={i} className={`w-20 h-20 cursor-pointer border-2 ${i === 0 ? 'border-purple-600' : 'border-transparent'}`}>
                    <img src={img} alt={`${product.title} ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                {product.condition}
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-700">
                  ${purchaseType === 'buy' ? product.price : product.rentalPrice}
                </span>
                {purchaseType === 'rent' && (
                  <span className="text-gray-500 text-sm">
                    for {product.rentalDuration}
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="purchaseType"
                    value="buy"
                    checked={purchaseType === 'buy'}
                    onChange={() => setPurchaseType('buy')}
                    className="form-radio h-4 w-4 text-purple-600"
                  />
                  <span className="ml-2 text-gray-700">Buy</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="purchaseType"
                    value="rent"
                    checked={purchaseType === 'rent'}
                    onChange={() => setPurchaseType('rent')}
                    className="form-radio h-4 w-4 text-purple-600"
                  />
                  <span className="ml-2 text-gray-700">Rent</span>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button 
                onClick={handleAddToCart} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex-1 flex items-center justify-center"
              >
                {purchaseType === 'buy' ? 'Buy Now' : 'Rent Now'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <button 
                onClick={handleContactSeller} 
                className="border border-gray-300 hover:border-purple-600 hover:text-purple-600 text-gray-700 font-semibold py-3 px-6 rounded-lg flex-1 flex items-center justify-center"
              >
                Contact Seller
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
            
            <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-gray-700">Category:</span> {product.category}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Theme:</span> {product.theme}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Posted:</span> {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-1 text-xs text-gray-500">({product.seller.reviewCount} reviews)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/product/${item.id}`}>
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
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
      </div>

      {/* Recommendations */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Items You Might Like</h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link to={`/product/${product.id}`}>
                  <div className="h-48 overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-purple-700 font-bold">${product.price}</span>
                        {product.rentalPrice && (
                          <span className="text-gray-500 text-sm ml-2">/ ${product.rentalPrice} to rent</span>
                        )}
                      </div>
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">{product.condition}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No similar items found</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
