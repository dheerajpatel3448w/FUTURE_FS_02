/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-indigo-200 opacity-50 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 -right-10 w-80 h-80 rounded-full bg-amber-200 opacity-40 blur-3xl"
        animate={{
          y: [0, -40, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.8, 
              ease: "easeOut" 
            }
          } : {}}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { 
                delay: 0.2,
                duration: 0.8 
              }
            } : {}}
          >
            <span className="block">Elevate Your</span>
            <motion.span 
              className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              Shopping Experience
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { 
                delay: 0.4,
                duration: 0.8 
              }
            } : {}}
          >
            Discover curated collections of premium products designed to transform your everyday life. 
            Handpicked quality, effortless style.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { 
                delay: 0.6,
                duration: 0.8 
              }
            } : {}}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Explore Collection
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-white text-indigo-600 font-medium border border-indigo-200 shadow-md hover:shadow-lg transition-all"
            >
              New Arrivals
            </motion.button>
          </motion.div>
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { 
            opacity: 1, 
            x: 0,
            transition: { 
              duration: 0.8, 
              delay: 0.4,
              ease: "easeOut" 
            }
          } : {}}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <motion.img
        src="https://tse1.mm.bing.net/th/id/OIP.-VsPzdxv0JSK6pUcXR0S4AHaHG?pid=Api&P=0&h=180"
        alt="Description of image"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1, transition: { duration: 0.8 } } : {}}
      />
            <div className="aspect-square bg-gray-200 border-2 border-dashed rounded-xl w-full" />
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-10"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-10"
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1
              }}
            >
              <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl" />
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 -mt-12 -mr-12 bg-indigo-500 rounded-full blur-xl opacity-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 6,
              repeat: Infinity
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;