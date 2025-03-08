import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage, auth } from '../firebase/config';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    theme: '',
    condition: 'Like New',
    price: '',
    offerRental: false,
    rentalPrice: '',
    rentalDuration: '3 days',
  });
  
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'Costumes',
    'Props',
    'Accessories',
    'Decorations',
    'Makeup',
    'Other'
  ];

  const themes = [
    'Western/Cowboy',
    'Hollywood/Glamour',
    'Superhero',
    '80s/Retro',
    'Halloween',
    'Masquerade',
    'Hawaiian/Tropical',
    'Christmas',
    'Sports',
    'Medieval/Renaissance',
    'Pirate',
    'Sci-Fi',
    'Roaring 20s',
    'Hippie/70s',
    'Disco',
    'Fantasy',
    'Other'
  ];

  const conditions = [
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Poor'
  ];

  const rentalDurations = [
    '1 day',
    '3 days',
    '1 week',
    '2 weeks'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }
    
    setImages(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return [];
    }
    
    const urls = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${auth.currentUser.uid}-${Date.now()}-${i}.${fileExt}`;
      const storageRef = ref(storage, `product-images/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setError('Error uploading images');
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            if (urls.length === images.length) {
              resolve();
            }
          }
        );
      });
    }
    
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      setError('You must be logged in to list an item');
      navigate('/login');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.price) {
        throw new Error('Please fill in all required fields');
      }
      
      if (formData.offerRental && !formData.rentalPrice) {
        throw new Error('Please provide a rental price');
      }
      
      // Upload images
      const imageUrls = await uploadImages();
      
      if (imageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }
      
      // Add product to Firestore
      const productData = {
        ...formData,
        keywords: [
          ...formData.title.toLowerCase().split(' '),
          ...formData.description.toLowerCase().split(' '),
          formData.category,
          formData.theme
        ].filter(k => k.length > 2),
        price: parseFloat(formData.price),
        rentalPrice: formData.offerRental ? parseFloat(formData.rentalPrice) : null,
        images: imageUrls,
        userId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName,
        sellerPhotoURL: auth.currentUser.photoURL,
        createdAt: serverTimestamp(),
        status: 'available'
      };
      
      const docRef = await addDoc(collection(db, 'products'), productData);
      
      // Navigate to the product page
      navigate(`/product/${docRef.id}`);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">List Your Party Item</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Basic Information</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="e.g., Cowboy Hat"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Describe your item, including details about size, material, and any imperfections"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="theme" className="block text-gray-700 text-sm font-bold mb-2">
                  Theme *
                </label>
                <select
                  id="theme"
                  name="theme"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={formData.theme}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a theme</option>
                  {themes.map((theme) => (
                    <option key={theme} value={theme.toLowerCase()}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Condition and Pricing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Condition and Pricing</h2>
            
            <div className="mb-4">
              <label htmlFor="condition" className="block text-gray-700 text-sm font-bold mb-2">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                Sale Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="offerRental"
                  className="form-checkbox h-5 w-5 text-purple-600"
                  checked={formData.offerRental}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700">Offer this item for rent</span>
              </label>
            </div>
            
            {formData.offerRental && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="rentalPrice" className="block text-gray-700 text-sm font-bold mb-2">
                    Rental Price ($) *
                  </label>
                  <input
                    type="number"
                    id="rentalPrice"
                    name="rentalPrice"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.rentalPrice}
                    onChange={handleChange}
                    required={formData.offerRental}
                  />
                </div>
                
                <div>
                  <label htmlFor="rentalDuration" className="block text-gray-700 text-sm font-bold mb-2">
                    Rental Duration *
                  </label>
                  <select
                    id="rentalDuration"
                    name="rentalDuration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.rentalDuration}
                    onChange={handleChange}
                    required={formData.offerRental}
                  >
                    {rentalDurations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Images</h2>
            
            <div className="mb-4">
              <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
                Upload Images * (up to 5)
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                onChange={handleImageChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">First image will be the cover image. Maximum 5 images, each up to 5MB.</p>
            </div>
            
            {imagePreview.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {imagePreview.map((url, index) => (
                    <div key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-0 left-0 bg-purple-600 text-white text-xs px-2 py-1">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploadProgress > 0 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Listing Item...'}
                </span>
              ) : (
                'List Item'
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              By listing this item, you agree to our Terms of Service and Listing Policies.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
