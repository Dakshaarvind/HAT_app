import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/solid';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
          {product.offerRental && (
            <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              Available for Rent
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">
            <Link to={`/product/${product.id}`} className="hover:text-purple-600">
              {product.title}
            </Link>
          </h3>
          <span className="bg-gray-100 text-xs px-2 py-1 rounded">{product.condition}</span>
        </div>
        
        <div className="flex items-center mb-2">
          <StarIcon className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">
            {product.rating || '4.5'} ({product.reviewCount || '12'} reviews)
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-purple-600">
              ${product.price}
            </span>
            {product.offerRental && (
              <span className="ml-2 text-sm text-gray-500">
                or ${product.rentalPrice}/day
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
