/* eslint-disable no-unused-vars */
// src/pages/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const OrderHistoryPage = () => {
  // Mock order data with populated products and address
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Simulate API call to fetch orders
  useEffect(() => {
    const fetchOrders = () => {
      setIsLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL_ORDER}/order/getorder`, {
        withCredentials: true,
        headers:{
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      }).then((response)=>{
        console.log(response.data.order);
      setOrders(response.data.order);
        setIsLoading(false);
      })
      // Simulate API delay
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      });
    };
    
    fetchOrders();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status details
  const getStatusDetails = (status) => {
    switch(status) {
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800',
          icon: <ClockIcon className="h-5 w-5" />,
          text: 'Processing'
        };
      case 'shipped':
        return { 
          color: 'bg-blue-100 text-blue-800',
          icon: <TruckIcon className="h-5 w-5" />,
          text: 'Shipped'
        };
      case 'delivered':
        return { 
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5" />,
          text: 'Delivered'
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800',
          icon: <XCircleIcon className="h-5 w-5" />,
          text: 'Cancelled'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800',
          icon: <ClockIcon className="h-5 w-5" />,
          text: 'Processing'
        };
    }
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBagIcon className="h-10 w-10 mr-3 text-indigo-600" />
            Your Order History
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            View all your past orders, track shipments, and manage returns
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 text-indigo-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders. Start shopping to see your order history here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700"
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusDetails = getStatusDetails(order.status);
              const orderDate = formatDate(order.createdAt);
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Order Header */}
                  <div 
                    className="p-6 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleOrderDetails(order?._id)}
                  >
                    <div className="flex items-center">
                      <div className={`${statusDetails.color} rounded-full p-2 mr-4`}>
                        {statusDetails.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order?._id.slice(-6).toUpperCase()}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {orderDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="mr-4 text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-semibold text-gray-900">${order?.totalamount.toFixed(2)}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedOrder === order._id ? 90 : 0 }}
                        className="text-gray-500"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Order Details - Collapsible */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Delivery Address */}
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <MapPinIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                Delivery Address
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-gray-900">{order?.address.street}</p>
                                <p className="text-gray-600">
                                  {order?.address.city}, {order?.address.state} {order?.address.zip}
                                </p>
                              </div>
                            </div>
                            
                            {/* Order Summary */}
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-600">Payment Method</span>
                                  <span className="font-medium">Cash on Delivery</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-600">Payment Status</span>
                                  <span className={`font-medium ${
                                    order?.paymentStatus === 'completed' 
                                      ? 'text-green-600' 
                                      : order?.paymentStatus === 'failed' 
                                        ? 'text-red-600' 
                                        : 'text-yellow-600'
                                  }`}>
                                    {order?.paymentStatus.charAt(0).toUpperCase() + order?.paymentStatus.slice(1)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Order Status</span>
                                  <span className={`font-medium ${statusDetails.color} px-2 py-1 rounded-full text-xs`}>
                                    {statusDetails.text}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Products */}
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Products</h4>
                          <div className="space-y-4 mb-8">
                            {order?.products.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl" />
                                <div className="ml-4 flex-1">
                                  <h5 className="font-medium text-gray-900">{item?.product?.title}</h5>
                                  <div className="flex justify-between mt-2">
                                    <div>
                                      <span className="text-gray-600 text-sm">Qty: {item?.quantity}</span>
                                      <span className="mx-2 text-gray-300">•</span>
                                      <span className="text-gray-600 text-sm">${item?.price?.toFixed(2)}</span>
                                    </div>
                                    <div className="font-medium">
                                      ${(item?.product?.price * item?.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Order Total */}
                          <div className="bg-gray-50 rounded-lg p-4 max-w-md ml-auto">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">${order?.totalamount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Shipping</span>
                              <span className="font-medium">$0.00</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Tax</span>
                              <span className="font-medium">${(order?.totalamount * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                              <span className="font-semibold text-gray-900">Total</span>
                              <span className="font-bold text-indigo-600">${(order?.totalamount * 1.08).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                          >
                            View Invoice
                          </motion.button>
                          {order.status === 'delivered' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                            >
                              Buy Again
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;