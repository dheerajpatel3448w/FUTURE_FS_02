/* eslint-disable no-unused-vars */
// src/pages/SingleProductPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, HeartIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { comment } from 'postcss';
import { data, useParams } from 'react-router-dom';

const SingleProductPage = () => {
  // Mock product data
  const product2 = {
    id: 1,
    title: "Premium Wireless Headphones",
    description: "Experience unparalleled sound quality with our premium wireless headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers and professionals alike.",
    category: "Electronics",
    price: 299.99,
    discountPrice: 249.99,
    availability: "in-stock",
    stock: 15,
    rating: 4.7,
    reviews: 128,
    images: [
      "/headphones-1.jpg",
      "/headphones-2.jpg",
      "/headphones-3.jpg",
      "/headphones-4.jpg"
    ],
    features: [
      "Active Noise Cancellation",
      "40-hour Battery Life",
      "Bluetooth 5.2",
      "Memory Foam Ear Cushions",
      "Built-in Microphone",
      "Foldable Design"
    ],
    specifications: {
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.2, 3.5mm Jack",
      "Battery": "40 hours playback",
      "Charging": "USB-C Fast Charging",
      "Color": "Matte Black"
    }
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "/avatar-1.jpg",
      rating: 5,
      date: "2023-05-15",
      comment: "These headphones are amazing! The sound quality is exceptional and the noise cancellation works perfectly. I can wear them all day without discomfort."
    },
    {
      id: 2,
      user: "Sarah Williams",
      avatar: "/avatar-2.jpg",
      rating: 4,
      date: "2023-04-28",
      comment: "Great headphones overall. Battery life is as advertised and the sound is crisp. Only minor complaint is that they feel a bit heavy after long use."
    },
    {
      id: 3,
      user: "Michael Chen",
      avatar: "/avatar-3.jpg",
      rating: 5,
      date: "2023-04-12",
      comment: "Worth every penny! The noise cancellation is incredible - I can't hear anything when I have these on. The sound quality is also top-notch."
    }
  ];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [product, setproduct] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    price: 0,
    discountPrice: 0,
    availability: "",
    stock: 0,
    rating: 0,
    reviews: 0,
    images: [],
    features: [],
    
  })
  const {id}= useParams();
useEffect(()=>{
axios.get(`${import.meta.env.VITE_API_URL_PRODUCT}/product/getproduct/${id}`,{
  withCredentials:true,
  headers:{
    Authorization:`Bearer ${JSON.parse(localStorage.getItem('token'))}`
  }  
})
.then((response) => {
  // Handle the response data
  console.log(response.data);
  setproduct(response.data.product);

})
.catch((error) => {
  // Handle any errors
  console.error("Error fetching product:", error);
});
},[]);
  const handleQuantityChange = (value) => {
    if (quantity + value > 0 && quantity + value <= product?.stock) {
      setQuantity(quantity + value);
    }
  };

  const handleAddToCart = () => {
    addcart(product);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);

  };
const addcart = async(product) => {
   try {
     const response = await axios.post(`${import.meta.env.VITE_API_URL_CART}/cart/createcart`, {productId:product._id ,quantity:quantity},{
      withCredentials:true,
      headers:{
      Authorization:`Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
     });
     console.log('Product added to cart:', response.data);
   } catch (error) {
     console.error('Error adding product to cart:', error);
   }
 }
  const handleReviewSubmit = async(e) => {
    e.preventDefault();
    
    
try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_PRODUCT}/product/rating/createrating`,{
        productId:product._id,
        comment:reviewForm.comment,
        rating:reviewForm.rating
    },{
        withCredentials:true,
        headers:{
            Authorization:`Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
    })
      const newReview = {
        id:response.data.rating._id,
        avatar: "/avatar-3.jpg",
        user:response.data.rating.user.name,
        rating: response.data.rating.rating,
        comment: response.data.rating.comment,
        date:new Date().toISOString().split('T')[0]
      };

       setAllReviews([newReview, ...allReviews]);
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
} catch (error) {
    console.error("Error submitting review:", error);
}
   
    
  };

  // Calculate rating percentages
  const ratingPercentages = [0, 0, 0, 0, 0];
  allReviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingPercentages[review.rating - 1] += 1;
    }
  });
  
  const maxRatingCount = Math.max(...ratingPercentages);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-indigo-600 font-medium mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Products
        </motion.button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex flex-col">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" >
                <img src={product.images[selectedImage]} alt="" className='object-cover w-full h-full' />
                </div>
            </motion.div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product?.images?.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-24" >
                    <img src={product.images[index]} alt="" className='object-cover w-full h-full' />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category and Favorite */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-indigo-600 font-semibold">{product.category}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-red-50"
              >
                {isFavorite ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-500" />
                )}
              </motion.button>
            </div>
            
            {/* Title */}
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {product.title}
            </motion.h1>
            
            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                {
                  console.log(product)
                }
              </div>
              <span className="text-gray-600">
                {product.rating} <span className="text-gray-400">({product.reviews} reviews)</span>
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline">
                <motion.span 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ${product?.discountPrice?.toFixed(2)}
                </motion.span>
                <span className="ml-3 text-xl text-gray-500 line-through">
                  ${product?.price?.toFixed(2)}
                </span>
                <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 font-medium rounded-full">
                  Save {Math.round((1 - product?.discountPrice / product?.price) * 100)}%
                </span>
              </div>
            </div>
            
            {/* Description */}
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {product.description}
            </motion.p>
            
            {/* Availability */}
            <div className="mb-8">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  product.availability === "In Stock"
                    ? 'bg-green-500' 
                    : product.availability === " Out of stock"
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                }`}></span>
                <span className="text-gray-700 font-medium">
                  {product.availability === "In Stock"
                    ? `In Stock (${product.stock} available)` 
                    : product.availability === "Out of Stock"
                      ? `Low Stock (Only ${product.stock} left)` 
                      : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {product?.features?.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-gray-600">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <motion.button
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                >
                  -
                </motion.button>
                <span className="px-4 py-3 font-medium">{quantity}</span>
                <motion.button
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                >
                  +
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 flex items-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </motion.button>
              
              <AnimatePresence>
                {isAddedToCart && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg"
                  >
                    Added to cart successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['description',  'reviews']?.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mb-16">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="prose max-w-none"
            >
              <p className="text-gray-600 mb-6">
                {
                    product.description
                }
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
              <ul className="grid grid-cols-2 gap-4 mb-6">
                {product?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          
          
        
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product?.rating?.toFixed(1)} out of 5
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i}
                          className={`h-6 w-6 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">{allReviews?.length} reviews</span>
                  </div>
                  
                  {/* Rating Breakdown */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars, index) => {
                      const percentage = allReviews?.length > 0 
                        ? (ratingPercentages[stars - 1] / allReviews?.length) * 100 
                        : 0;
                      return (
                        <div key={stars} className="flex items-center">
                          <div className="w-10 text-sm text-gray-600">{stars} stars</div>
                          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-yellow-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            ></motion.div>
                          </div>
                          <div className="w-10 text-right text-sm text-gray-600">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Review Form */}
                {showReviewForm ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({...reviewForm, rating: star})}
                              className="text-gray-300 focus:outline-none"
                            >
                              <StarIcon
                                className={`h-8 w-8 ${
                                  star <= reviewForm?.rating 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review
                        </label>
                        <textarea
                          id="comment"
                          rows="4"
                          value={reviewForm?.comment}
                          onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Share your experience with this product..."
                        ></textarea>
                      </div>
                      
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg"
                        >
                          Submit Review
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <div className="bg-indigo-50 rounded-xl p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                      Share your experience
                    </h3>
                    <p className="text-indigo-700 mb-4">
                      Help others by sharing your thoughts about this product
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowReviewForm(true)}
                      className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg"
                    >
                      Write a Review
                    </motion.button>
                  </div>
                )}
              </div>
              
              {/* Reviews List */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                <div className="space-y-8">
                  {allReviews?.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm p-6"
                    >
                      <div className="flex items-start">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">{review.user}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex mt-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review?.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Related Products */}
       
      </div>
    </div>
  );
};

export default SingleProductPage;