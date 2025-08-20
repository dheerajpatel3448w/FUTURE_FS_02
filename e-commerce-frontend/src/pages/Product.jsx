/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from '../components/pagination';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  
  const addcart = async(product) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL_CART}/cart/createcart`, {productId:product._id ,quantity:1},{
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

  return (
    <motion.div
      className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setTimeout(() => setIsTouched(false), 300)}
    >
      <div className="relative h-48 md:h-64 overflow-hidden">
        {/* Product Image */}
        <div className={`bg-gray-200 border-2 border-dashed rounded-xl w-full h-full ${product.images[0]}`} >
          <img src={product.images[0]} alt={product.title} className='object-cover w-full h-full' />
        </div>
        
        {/* Category badge */}
        <motion.span 
          className="absolute top-2 left-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {product.category}
        </motion.span>
        
        {/* Availability badge */}
        <motion.span 
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded ${
            product.availability === "In Stock" 
              ? "bg-green-100 text-green-800" 
              : product.availability === "Out of Stock" 
                ? "bg-amber-100 text-amber-800" 
                : "bg-rose-100 text-rose-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {product.availability}
        </motion.span>
        
        {/* Quick View Button - Show on mobile when touched */}
        <AnimatePresence>
          {(isHovered || isTouched) && (
            <motion.button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={`/products/${product._id}`}>Quick View</Link>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="w-4/5">
            <h3 className="text-base font-bold text-gray-900 line-clamp-1">{product.title}</h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
          </div>
          
          <motion.div
            className="flex-shrink-0"
            animate={{ 
              scale: (isHovered || isTouched) ? 1.1 : 1,
              rotate: (isHovered || isTouched) ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <button className="p-1 md:p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          
          <motion.button
            className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={product.availability === "Out of Stock"}
            onClick={()=>{addcart(product)}}
          >
            {product.availability === "Out of Stock" ? "Notify Me" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(0);
  const location = useLocation();
  const [products, setproducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    setproducts(location.state?.product || []);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.state?.product]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    choosepage(newPage);
  };

  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    sort: 'featured'
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  ;
  console.log(products);
  
  let filteredProducts = products?.filter(product => {
    return (
      (filters.category === 'all' || product.category === filters.category) &&
      (filters.availability === 'all' || 
        (filters.availability === 'in-stock' && product.availability =="in-stock") ||
        (filters.availability === 'out-of-stock' && product.availability == "out-of-stock")
      )
    );
  });
  
  if (filters.sort === 'price-low') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-high') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }
  
  const choosepage = async(page) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL_PRODUCT}/product/category2?category=${location.state?.category}&page=${page}&limit=10`, {
        withCredentials:true,
        headers:{
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      settotalPages(response.data.totalPages);
      setproducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  
  if(products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">No products found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-[50px]">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Our Collection
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-lg md:text-xl text-gray-500">
            Discover products curated for quality, style, and performance
          </p>
        </motion.div>
        
        {/* Filter Bar */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 p-4 md:p-5 bg-white rounded-xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing <span className="font-semibold">{filteredProducts?.length}</span> of <span className="font-semibold">{products.length}</span> products
          </div>
          
          <div className="flex flex-wrap gap-3 md:gap-4 w-full md:w-auto justify-center">
            <div className="relative w-full md:w-auto">
              <button 
                className="flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    className={`absolute z-20 mt-2 bg-white rounded-lg shadow-lg p-4 ${
                      isMobile ? 'left-0 right-0 mx-4' : 'right-0 w-64'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {/* Close button for mobile */}
                    {isMobile && (
                      <button 
                        className="absolute top-2 right-2 text-gray-500"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        value={filters?.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                      >
                        <option value="all">All Categories</option>
                        {/* Add your category options here */}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                      <select 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        value={filters?.availability}
                        onChange={(e) => setFilters({...filters, availability: e.target.value})}
                      >
                        <option value="all">All</option>
                        <option value="in-stock">In Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-full md:w-auto">
              <select 
                className="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 pl-4 pr-8 py-2 rounded-lg appearance-none transition-colors w-full md:w-auto"
                value={filters?.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredProducts?.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* No Products Found */}
        {filteredProducts?.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your filters to find what you're looking for
            </p>
            <button 
              className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700"
              onClick={() => setFilters({ category: 'all', availability: 'all', sort: 'featured' })}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="mt-8 px-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Products;