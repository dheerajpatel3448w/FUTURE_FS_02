/* eslint-disable no-unused-vars */
// src/pages/CartPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowLeftIcon, ShoppingBagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  // Mock cart data with populated products
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

  // Simulate fetching cart data from backend
  useEffect(() => {
    const fetchCartData = () => {
      setIsLoading(true);
      // Simulating API call
      axios.get(`${import.meta.env.VITE_API_URL_CART}/cart/getcart`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      }).then((response) => {
        console.log("Cart data fetched successfully:", response.data);
        setCart(response.data.cart);
        setIsLoading(false);
    }).catch((error)=>{
        console.error("Failed to fetch cart data",error);
        setIsLoading(false);
    })
    };

    fetchCartData();
  }, []);

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + (item.productId?.discountPrice * item.quantity);
    }, 0);
    
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // Update quantity in cart
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    
    // Find the item to check stock
    const item = cart.find(item => item._id === itemId);
    if (newQuantity > item.productId.stock) {
      newQuantity = item.productId.stock;
    }
    
    // Simulate API call to update backend
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL_CART}/cart/updatequantity`, { productId: itemId, quantity: newQuantity }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
      if (response.status === 200) {
        console.log("Cart updated successfully:", response.data);
        setCart(cart.map(item => 
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
      
      setUpdateSuccess(true);
    
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    setRemovingItem(itemId);
    
    // Simulate API call to remove from backend
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL_CART}/cart/deletecart/${itemId}`,{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
      if (response.status === 200) {
        // Update local state
        setCart(cart.filter(item => item._id !== itemId));
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemovingItem(null);
    }
  };

  // Empty cart
  const emptyCart = async () => {
    setIsUpdating(true);
    
    // Simulate API call to empty cart
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL_CART}/cart/deleteallcart`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
          }
        });
        if (response.status === 200) {
          setCart([]);
        }
    } catch (error) {
      console.error("Failed to empty cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 mt-[50px]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-indigo-600 font-medium"
             onClick={() => navigate('/')}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2"/>

            Continue Shopping
          </motion.button>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ShoppingBagIcon className="h-8 w-8 mr-3 text-indigo-600" />
            Your Shopping Cart
          </motion.h1>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 text-indigo-600"
            >
              <ArrowPathIcon />
            </motion.div>
          </div>
        ) : cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it with amazing products!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {cart.length} {cart.length === 1 ? 'Item' : 'Items'} in Cart
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={emptyCart}
                    disabled={isUpdating}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    {isUpdating ? (
                      <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 mr-1" />
                    )}
                    Empty Cart
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: { duration: 0.4 } 
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { duration: 0.3 } 
                      }}
                      className={`border-b border-gray-100 ${removingItem === item._id ? 'opacity-50' : ''}`}
                    >
                      <div className="p-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl" >
                          <img src={item?.productId?.images[0]} alt={item?.productId?.title} className="object-cover w-full h-full" />
                          </div>
                        
                        <div className="ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item?.productId?.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item?.productId?.category}
                              </p>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item._id)}
                              disabled={removingItem === item._id}
                              className="text-gray-400 hover:text-red-500"
                            >
                              {removingItem === item._id ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              ) : (
                                <XMarkIcon className="h-5 w-5" />
                              )}
                            </motion.button>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <motion.button
                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item?._id, item?.quantity - 1)}
                                disabled={isUpdating}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md text-gray-600"
                              >
                                -
                              </motion.button>
                              
                              <motion.div
                                key={item?.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="w-12 h-8 flex items-center justify-center border-y border-gray-300 text-center"
                              >
                                {item?.quantity}
                              </motion.div>
                              
                              <motion.button
                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateQuantity(item?._id, item?.quantity + 1)}
                                disabled={isUpdating || item?.quantity >= item?.productId?.stock}
                                className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md ${
                                  item?.quantity >= item?.productId?.stock 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-gray-600'
                                }`}
                              >
                                +
                              </motion.button>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ${(item?.productId?.discountPrice * item?.quantity)?.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item?.productId?.discountPrice?.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                          
                          {item?.quantity >= item?.productId?.stock && (
                            <div className="mt-2 text-sm text-yellow-700">
                              Only {item?.productId?.stock} available in stock
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Coupon Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Have a coupon code?</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-r-lg"
                  >
                    Apply
                  </motion.button>
                </div>
              </motion.div>
            </div>
            
            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-6 sticky top-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl"
                >
                    <Link to={`/order`}>Proceed to Checkout</Link>    
                </motion.button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over $100
                  </p>
                </div>
              </motion.div>
              
              {/* Recently Viewed */}
             
            </div>
          </div>
        )}
        
        {/* Update Success Indicator */}
        <AnimatePresence>
          {updateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cart updated successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;