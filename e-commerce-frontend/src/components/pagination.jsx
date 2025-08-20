/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  pageNeighbors = 1
}) => {
  // Calculate range of pages to display
  const calculatePageRange = () => {
    const totalNumbers = (pageNeighbors * 2) + 3;
    const totalButtons = totalNumbers + 2;

    if (totalPages > totalButtons) {
      const startPage = Math.max(2, currentPage - pageNeighbors);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);
      let pages = [];
      
      // Add first page
      pages.push(1);
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('left-ellipsis');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('right-ellipsis');
      }
      
      // Add last page
      pages.push(totalPages);
      
      return pages;
    }
    
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = calculatePageRange();

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
        whileTap={{ scale: 0.95 }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
          currentPage === 1 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Prev
        </div>
      </motion.button>
      
      {/* Page Numbers */}
      <div className="flex space-x-1">
        {pages.map((page, index) => {
          if (page === 'left-ellipsis' || page === 'right-ellipsis') {
            return (
              <motion.div
                key={index}
                className="flex items-end px-3 py-2 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ...
              </motion.div>
            );
          }
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {page}
            </motion.button>
          );
        })}
      </div>
      
      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
        whileTap={{ scale: 0.95 }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
          currentPage === totalPages 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        <div className="flex items-center">
          Next
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </motion.button>
    </div>
  );
};

export default Pagination;