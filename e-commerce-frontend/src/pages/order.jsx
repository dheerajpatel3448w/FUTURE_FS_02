/* eslint-disable no-unused-vars */
// src/pages/OrderPage.js
import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  CheckCircleIcon, 
  TruckIcon,
  CreditCardIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { _email } from 'zod/v4/core';

const OrderPage = () => {
  // Mock user data with addresses

  const [user, setUser] = useState({
    _id: "user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    addresses: [
      {
        _id: "addr-1",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001"
      },
      {
        _id: "addr-2",
        street: "456 Park Avenue",
        city: "Brooklyn",
        state: "NY",
        zip: "11201"
      }
    ]
  });

  // Mock cart data
  const [cart, setcart] = useState([
    {
      _id: "cart-item-1",
      productId: {
        _id: "prod-1",
        name: "Premium Wireless Headphones",
        price: 249.99,
        image: "/headphones.jpg"
      },
      quantity: 2
    },
    {
      _id: "cart-item-2",
      productId: {
        _id: "prod-2",
        name: "Smart Fitness Tracker",
        price: 79.99,
        image: "/fitness-tracker.jpg"
      },
      quantity: 1
    }
  ]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL_CART}/cart/getcart`,
        {
            withCredentials: true,
            headers:{
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        }
    ) .then(response => {
        console.log("Cart data fetched successfully:", response.data);
        setcart(response.data.cart);
      })
      .catch(error => {
        console.error("Error fetching cart data:", error);
      });

      axios.get(`${import.meta.env.VITE_API_URL_AUTH}/user/address/getaddress`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
          }
        }
      ).then(response => {
        console.log("Address data fetched successfully:", response.data);
        if (response.data.address && response.data.address.length !== 0) {
          setUser(prev => ({
            
            addresses: [ ...response.data.address],
            _id: response.data.address[0].user._id,
            name: response.data.address[0].user.name,
          email: response.data.address[0].user.email
        }));
    }
      })
      .catch(error => {
        console.error("Error fetching address data:", error);
      });
  }, [])
console.log("Cart data:", cart);
  // State variables
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });
console.log("User data:", user);
  // Calculate order total
  const orderTotal = cart?.reduce(
(total, item) => total + (item.productId?.discountPrice * item?.quantity),
    0
  );
  
  const shippingCost = orderTotal > 100 ? 0 : 9.99;
  const tax = orderTotal * 0.08;
  const grandTotal = orderTotal + shippingCost + tax;

  // Handle address form input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  // Submit new address
  const handleAddAddress = async(e) => {
    e.preventDefault();
    
    // Create a new address object with a mock ID
   

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL_AUTH}/user/address/address`, newAddress, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
      console.log("Address added successfully:", response.data);
       setSelectedAddress(response.data.address._id);
    setShowAddressForm(false);
    setNewAddress({ street: "", city: "", state: "", zip: "" });
      setUser(prev => ({
        ...prev,
        addresses: [...prev.addresses, response.data.address],
        
      }));
    } catch (error) {
      console.error("Error adding address:", error);
    }
  

      


   
  };

  // Place order function (simulating API call)
  const placeOrder = () => {
    setIsLoading(true);
    
    axios.post(`${import.meta.env.VITE_API_URL_ORDER}/order/createorder`, {
        
        address: selectedAddress,
        carts:cart,
        paymentMethod: "cod",
       
    },{
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    }).then(response => {
        console.log("Order placed successfully:", response.data);
        setOrderDetails(response.data.order);
      setIsOrderPlaced(true);
      setIsLoading(false);
    }).catch((error) => {
        console.error("Error placing order:", error);
        
    })
    // Simulate API call to backend

  };
console.log("Selected address:", selectedAddress);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-indigo-600 font-medium mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Cart
        </motion.button>

        {/* Page Heading */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Complete Your Order
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Review your items, select delivery address, and confirm your purchase
          </motion.p>
        </motion.div>

        {/* Main Content */}
        {isOrderPlaced ? (
          <OrderConfirmation order={orderDetails} address={user.addresses.find(a => a._id === selectedAddress)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Address Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <HomeIcon className="h-6 w-6 mr-2 text-indigo-600" />
                    Delivery Address
                  </h2>
                  {!showAddressForm && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm text-indigo-600 font-medium flex items-center"
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-1" />
                      Add New Address
                    </motion.button>
                  )}
                </div>

                {showAddressForm ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            name="street"
                            value={newAddress.street}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zip"
                            value={newAddress.zip}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg"
                        >
                          Save Address
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <motion.div
                        key={address._id}
                        whileHover={{ y: -5 }}
                        className={`border rounded-xl p-5 cursor-pointer transition-all ${
                          selectedAddress === address._id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                        onClick={() => setSelectedAddress(address._id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {address.street}
                            </h3>
                            <p className="text-gray-600">
                              {address.city}, {address.state} {address.zip}
                            </p>
                          </div>
                          {selectedAddress === address._id && (
                            <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <CreditCardIcon className="h-6 w-6 mr-2 text-indigo-600" />
                  Payment Method
                </h2>

                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                        <TruckIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                        <p className="text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full border-2 border-indigo-600 flex items-center justify-center mr-2">
                        <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                      </div>
                      <span className="text-indigo-600 font-medium">Selected</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>Note: Online payment options are currently unavailable. Please pay with cash when your order is delivered.</p>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 border-2 border-dashed rounded-xl" >
                        <img src={item.productId?.image} alt=""  className='w-full h-full object-cover' />
                        </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.productId.title}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            ${(item.productId?.discountPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl shadow-md p-6 sticky top-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${orderTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <TruckIcon className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <p className="text-sm text-indigo-700">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={placeOrder}
                  disabled={!selectedAddress || isLoading}
                  className={`w-full py-3 rounded-lg font-medium ${
                    !selectedAddress || isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Confirm Order"
                  )}
                </motion.button>

                {!selectedAddress && (
                  <p className="mt-3 text-sm text-red-600 text-center">
                    Please select a delivery address to continue
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Confirmation Component
const OrderConfirmation = ({ order, address }) => {
     const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-20 mb-6">
          <CheckCircleIcon className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-indigo-200">
          Thank you for your order. Your order ID is <span className="font-semibold">{order?._id}</span>
        </p>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{address?.street}</p>
              <p className="text-gray-600">
                {address?.city}, {address?.state} {address?.zip}
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order Total</span>
                <span className="font-medium">${order?.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-medium">3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </motion.button>
          <p className="mt-4 text-gray-600">
            We've sent an order confirmation to your email
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderPage;