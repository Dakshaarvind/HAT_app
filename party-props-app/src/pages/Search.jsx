import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    theme: '',
    minPrice: '',
    maxPrice: '',
    offerRental: false,
    sortBy: 'createdAt_desc'
  });

  const searchTerm = new URLSearchParams(location.search).get('q') || '';

  const buildQuery = () => {
    let q = query(collection(db, 'products'));
    
    // Text search
    if (searchTerm) {
      q = query(q, where('keywords', 'array-contains', searchTerm.toLowerCase()));
    }
    
    // Filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.theme) {
      q = query(q, where('theme', '==', filters.theme));
    }
    if (filters.minPrice) {
      q = query(q, where('price', '>=', parseFloat(filters.minPrice)));
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', parseFloat(filters.maxPrice)));
    }
    if (filters.offerRental) {
      q = query(q, where('offerRental', '==', true));
    }
    
    // Sorting
    const [sortField, sortOrder] = filters.sortBy.split('_');
    q = query(q, orderBy(sortField, sortOrder === 'desc' ? 'desc' : 'asc'));
    
    return q;
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const q = buildQuery();
      const querySnapshot = await getDocs(q);
      setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchProducts();
  }, [location.search, filters]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filter Results</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  <option value="costumes">Costumes</option>
                  <option value="props">Props</option>
                  <option value="accessories">Accessories</option>
                  <option value="decorations">Decorations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border rounded-md"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border rounded-md"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="offerRental"
                  className="h-4 w-4 text-purple-600"
                  checked={filters.offerRental}
                  onChange={(e) => setFilters({...filters, offerRental: e.target.checked})}
                />
                <label htmlFor="offerRental" className="ml-2 text-sm">Show Rentals Only</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {searchTerm ? `Results for "${searchTerm}"` : 'Browse All Items'}
            </h1>
            <p className="text-gray-600 mt-1">{results.length} items found</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
