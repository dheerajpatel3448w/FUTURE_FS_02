/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, Fragment, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Transition, Popover, Disclosure } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import {
AiOutlineHeart,
AiOutlineShoppingCart,
AiOutlineMenu,
AiOutlineClose,
AiOutlineSearch,
AiOutlineUser,
} from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { UserContext } from "../context/user.context";



export default function Navbar() {
const [query, setQuery] = useState("");
const [filtered, setFiltered] = useState([]);
const [activeIdx, setActiveIdx] = useState(-1);
const [cartCount, setCartCount] = useState(3);
const [mobileOpen, setMobileOpen] = useState(false);
const [badgeTrigger, setBadgeTrigger] = useState(false);
const searchRef = useRef(null);
const suggestionsRef = useRef(null);
const navigate = useNavigate();

const [user2, setuser2] = useState(null);


useEffect(()=>{
  axios.get(`${import.meta.env.VITE_API_URL_AUTH}/user/profile`,{
    withCredentials:true,
    headers:{
     Authorization:`Bearer ${JSON.parse(localStorage.getItem("token"))}`
    }
  })
  .then(response => {
    setuser2(response.data.user);
    console.log(response.data.user);
  })
  .catch(error => {
    console.error("Error fetching user data:", error);
    alert("please login !");
    navigate('/login');
  });
}, []);

const handlelogout = async (params) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_AUTH}/user/logout`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
      }
    });
    console.log("Logout successful:", response.data);
    localStorage.removeItem("token");
    setuser2(null);
    navigate('/');
  } catch (error) {
    console.error("Logout failed:", error);
  }
  
}

useEffect(() => {
if (!query) {
setFiltered([]);
setActiveIdx(-1);
return;
}
const q = query.toLowerCase();

const f = suggestionsSample.filter((s) => s.toLowerCase().includes(q));
setFiltered(f);
setActiveIdx(f.length ? 0 : -1);
}, [query]);
let categoriesSample;

 categoriesSample = [
{
name: "Electronics",
sub: [
{ name: "Laptops", to: "Laptop" },
{ name: "Smartphones", to: "Smartphone" },
{ name: "Audio", to: "audio" },
{ name: "Wearables", to: "wearables" },
],
},
{
name: "Fashion",
sub: [
{ name: "Men", to: "men" },
{ name: "Women", to: "women" },
{ name: "Footwear", to: "footwear" },
{ name: "Accessories", to: "accessories" },
],
},
{
name: "Home",
sub: [
{ name: "Kitchen", to: "kitchen" },
{ name: "Furniture", to: "furniture" },
{ name: "Decor", to: "decor" },
{ name: "Lighting", to: "lighting" },
],
},
{
name: "Beauty",
sub: [
{ name: "Skin Care", to: "skin-care" },
{ name: "Hair Care", to: "hair-care" },
{ name: "Fragrances", to: "fragrances" },
{ name: "Makeup", to: "makeup" },
],
},
];

const categorysample2= [{
  name:"adminpanel",
  sub: [
  
    { name: "createProducts", to: "admin/products" },
    { name: "Orders", to: "admin/orders" },
    
  ]

}]

const suggestionsSample = [
"Wireless Headphones",
"iPhone 14 Case",
"Running Shoes",
"Leather Jacket",
"Organic Green Tea",
"Smartwatch Series 7",
"Yoga Mat",
"Travel Backpack",
"4K Monitor",
"Noise Cancelling Earbuds",
];

const userSample = {
name: "Dheeraj Patel",
avatar: null, // fallback to initials
};

const logoVariants = {
hidden: { opacity: 0, y: -8, scale: 0.95 },
visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const navItemVariants = {
rest: { y: 0 },
hover: { y: -3 },
};

const dropdownVariants = {
hidden: { opacity: 0, y: -8, scale: 0.98 },
visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
exit: { opacity: 0, y: -6, scale: 0.99, transition: { duration: 0.12 } },
};

const badgeVariants = {
idle: { scale: 1 },
pop: { scale: [1, 1.4, 1], transition: { duration: 0.4 } },
};





















const chooseproduct = async(to) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_PRODUCT}/product/category?category=${to}`,{
      withCredentials:true,
      headers:{
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
      },
      
     
    });
     navigate('/products',{

      state:{
        product: response.data.products,
        category: to
      }
     });
    
  } catch (error) {
    console.log(error);
    alert("please login !");
     navigate('/products',{

      state:{
        product: [],
        category: to
      }
     });
    
  }

  
}


useEffect(() => {
// animate badge when cartCount changes
setBadgeTrigger(true);
const t = setTimeout(() => setBadgeTrigger(false), 420);
return () => clearTimeout(t);
}, [cartCount]);

useEffect(() => {
function handleClickOutside(e) {
if (searchRef.current && !searchRef.current.contains(e.target)) {
setFiltered([]);
setActiveIdx(-1);
}
}
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

function onKeyDown(e) {
if (!filtered.length) return;
if (e.key === "ArrowDown") {
e.preventDefault();
setActiveIdx((s) => (s + 1) % filtered.length);
} else if (e.key === "ArrowUp") {
e.preventDefault();
setActiveIdx((s) => (s - 1 + filtered.length) % filtered.length);
} else if (e.key === "Enter") {
e.preventDefault();
if (activeIdx >= 0 && filtered[activeIdx]) {
selectSuggestion(filtered[activeIdx]);
}
} else if (e.key === "Escape") {
setFiltered([]);
setActiveIdx(-1);
}
}

function selectSuggestion(value) {
setQuery(value);
setFiltered([]);
setActiveIdx(-1);
// emulate navigation or search submission
// e.g., navigate to search results: history.push(/search?q=${encodeURIComponent(value)})
}

return (
<div className="w-full min-h-[72px] fixed z-50">
<header
className="w-full"
style={{ background: undefined }}
>
<div className="bg-gradient-to-r from-[#FFEDD5] via-[#FDE68A] to-[#FBCFE8]">
<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" aria-label="Top Navigation" >
<div className="flex items-center justify-between gap-4">
{/* Left: Brand */}
<div className="flex items-center gap-3 min-w-[160px]">
<motion.div
className="flex items-center gap-3"
initial="hidden"
animate="visible"
variants={logoVariants}
>
<Link to="/" className="flex items-center gap-3" aria-label="Homepage">
<motion.div
className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
style={{
background:
"linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.12))",
}}
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.98 }}
>
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
<rect x="3" y="3" width="18" height="18" rx="6" fill="url(#g)" />
<defs>
<linearGradient id="g" x1="0" x2="1">
<stop offset="0" stopColor="#6366F1" stopOpacity="0.18" />
<stop offset="1" stopColor="#EC4899" stopOpacity="0.18" />
</linearGradient>
</defs>
</svg>
</motion.div>
<div className="flex flex-col leading-tight">
<span className="text-lg font-semibold tracking-tight text-slate-800">DKR</span>
<span className="text-xs -mt-0.5 text-slate-600">curated goods</span>
</div>
</Link>
</motion.div>
</div>

          {/* Center: Search + Primary nav */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl relative" ref={searchRef}>
              <div className="hidden md:flex items-center gap-4">
                <div
                  className="flex items-center w-full rounded-2xl shadow-sm px-3 py-2 backdrop-blur-sm bg-[rgba(251,207,232,0.45)]"
                  role="search"
                >
                  <AiOutlineSearch className="text-slate-600 w-5 h-5" aria-hidden />
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none px-3 text-slate-700 placeholder-slate-500"
                    placeholder="Search for products, brands and more..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-autocomplete="list"
                    aria-controls="search-suggestions"
                    aria-expanded={filtered.length > 0}
                  />
                  <button
                    className="px-3 py-1 rounded-xl text-sm font-medium bg-gradient-to-r from-[#FDE68A] to-[#FBCFE8] shadow-sm"
                    aria-label="Search"
                    onClick={() => {
                      // emulate search submit
                      setFiltered([]);
                      setActiveIdx(-1);
                      chooseproduct(query)
                   
                    }}>
                    Search
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {filtered.length > 0 && (
                  <motion.ul
                    id="search-suggestions"
                    role="listbox"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0, y: -6 },
                      visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.02 } },
                      exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
                    }}
                    className="absolute z-50 left-0 right-0 mt-2 rounded-2xl shadow-lg p-2 grid gap-1"
                    style={{ background: "rgba(252,244,255,0.75)", backdropFilter: "blur(6px)" }}
                    ref={suggestionsRef}
                  >
                    {filtered.map((s, i) => (
                      <motion.li
                        key={s}
                        role="option"
                        aria-selected={activeIdx === i}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseDown={(e) => {
                          // prevent blur
                          e.preventDefault();
                          selectSuggestion(s);
                        }}
                        variants={{
                          hidden: { opacity: 0, y: -4 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ scale: 1.01 }}
                        className={`cursor-pointer select-none rounded-xl px-3 py-2 text-sm ${
                          activeIdx === i ? "font-medium shadow-inner" : "text-slate-700"
                        }`}
                      >
                        {s}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Primary nav for md+ */}
            <div className="hidden md:flex items-center gap-2 ml-6">
              <ul className="flex items-center gap-1" role="menubar" aria-label="Primary navigation">
                {categoriesSample.map((cat) => (
                  <li key={cat.name} className="relative">
                    <Popover className="relative">
                      {({ open }) => (
                        <>
                          <Popover.Button
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                            aria-haspopup="true"
                            aria-expanded={open}
                          >
                            <motion.span
                              className="text-sm font-medium text-slate-800"
                              variants={navItemVariants}
                              initial="rest"
                              whileHover="hover"
                              animate="rest"
                            >
                              {cat.name}
                            </motion.span>
                            <BiChevronDown className="w-4 h-4 text-slate-700" aria-hidden />
                          </Popover.Button>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-150"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel static className="absolute left-0 mt-3 w-64 z-40">
                              {open && (
                                <motion.div
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={dropdownVariants}
                                  className="rounded-2xl shadow-lg p-4"
                                  style={{ background: "rgba(255,245,250,0.85)", backdropFilter: "blur(6px)" }}
                                >
                                  <ul className="grid grid-cols-1 gap-2">
                                    {cat.sub.map((sub) => (
                                      <li key={sub.name}>
                                        <div
                                          className="block px-3 py-2 rounded-xl hover:bg-[rgba(236,72,153,0.06)]"
                                          
                                        >
                                          <button className="text-sm font-medium text-slate-800"  onClick={()=>chooseproduct(sub.to)}>{sub.name}</button>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </li>
                ))}
                  {user2?.role==="admin" && categorysample2.map((cat) => (
                  <li key={cat.name} className="relative">
                    <Popover className="relative">
                      {({ open }) => (
                        <>
                          <Popover.Button
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                            aria-haspopup="true"
                            aria-expanded={open}
                          >
                            <motion.span
                              className="text-sm font-medium text-slate-800"
                              variants={navItemVariants}
                              initial="rest"
                              whileHover="hover"
                              animate="rest"
                            >
                              {cat.name}
                            </motion.span>
                            <BiChevronDown className="w-4 h-4 text-slate-700" aria-hidden />
                          </Popover.Button>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-150"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel static className="absolute left-0 mt-3 w-64 z-40">
                              {open && (
                                <motion.div
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={dropdownVariants}
                                  className="rounded-2xl shadow-lg p-4"
                                  style={{ background: "rgba(255,245,250,0.85)", backdropFilter: "blur(6px)" }}
                                >
                                  <ul className="grid grid-cols-1 gap-2">
                                    {cat.sub.map((sub) => (
                                      <li key={sub.name}>
                                        <div
                                          className="block px-3 py-2 rounded-xl hover:bg-[rgba(236,72,153,0.06)]"
                                          
                                        >
                                          <Link to={sub.to}><button className="text-sm font-medium text-slate-800" >{sub.name}</button></Link>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3 min-w-[140px] justify-end">
            <div className="hidden md:flex items-center gap-3">
              <button
                aria-label="Wishlist"
                className="p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
              >
                <AiOutlineHeart className="w-5 h-5 text-slate-700" />
              </button>

              <button
                aria-label="Cart"
                className="relative p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                onClick={() => setCartCount((c) => c + 1)}
              >
                <AiOutlineShoppingCart className="w-5 h-5 text-slate-700" onClick={() => navigate('/cart')} />
                <motion.span
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center text-xs font-semibold rounded-full h-5 min-w-[20px] px-1 leading-none shadow"
                  style={{ background: "linear-gradient(90deg,#FDE68A,#FBCFE8)" }}
                  aria-live="polite"
                  variants={badgeVariants}
                  initial="idle"
                  animate={badgeTrigger ? "pop" : "idle"}
                >
                  {cartCount}
                </motion.span>
              </button>

              <Menu as="div" className="relative">
                <div>
                  <Menu.Button
                    className="flex items-center gap-2 px-2 py-1 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-[rgba(99,102,241,0.12)] flex items-center justify-center text-sm font-semibold text-slate-800">
                      {user2?.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <span className="hidden sm:inline text-sm text-slate-700">{user2?.name?.split(" ")[0]}</span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Menu.Items
                    className="absolute right-0 mt-2 w-48 rounded-2xl shadow-lg p-2 z-50"
                    static
                    style={{ background: "rgba(252,243,255,0.9)", backdropFilter: "blur(6px)" }}
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-3 py-2 rounded-xl text-sm ${active ? "bg-[rgba(236,72,153,0.06)]" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            <AiOutlineUser className="w-4 h-4" /> Profile
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/order-history"
                          className={`block px-3 py-2 rounded-xl text-sm ${active ? "bg-[rgba(236,72,153,0.06)]" : ""}`}
                        >
                          Orders
                        </Link>
                      )}
                    </Menu.Item>
                     { !user2 && <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm ${active ? "bg-[rgba(236,72,153,0.06)]" : ""}`}
                          onClick={() => {
                            navigate('/login');
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FiLogOut className="w-4 h-4" /> Login
                          </div>
                        </button>
                      )}
                    </Menu.Item>
}                   { user2 &&
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm ${active ? "bg-[rgba(236,72,153,0.06)]" : ""}`}
                          onClick={() => {
                           handlelogout();
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FiLogOut className="w-4 h-4" /> Logout
                          </div>
                        </button>
                      )}
                    </Menu.Item>
               }
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
              >
                <AiOutlineMenu className="w-6 h-6 text-slate-800" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>

  {/* Mobile Slide-in Panel */}
  <AnimatePresence>
    {mobileOpen && (
      <>
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          style={{ backdropFilter: "blur(4px)" }}
        />
        <motion.aside
          id="mobile-menu"
          className="fixed top-0 right-0 h-full w-80 z-50 p-4"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.28 }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="h-full rounded-2xl p-4 shadow-lg flex flex-col"
            style={{ background: "linear-gradient(180deg, rgba(255,250,240,0.95), rgba(255,240,245,0.95))" }}
          >
            <div className="flex items-center justify-between">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow" style={{ background: "rgba(99,102,241,0.12)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="6" fill="#E9D5FF" />
                  </svg>
                </div>
                <span className="font-semibold">Shoply</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
              >
                <AiOutlineClose className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4">
              <div className="rounded-2xl p-2 backdrop-blur-sm" style={{ background: "rgba(251,207,232,0.25)" }}>
                <div className="flex items-center gap-2 px-2 py-2 rounded-xl">
                  <AiOutlineSearch className="w-5 h-5" />
                  <input
                    className="bg-transparent outline-none w-full text-sm"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Mobile search"
                  />
                  <button
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#FDE68A] to-[#FBCFE8] text-sm"
                    onClick={() => {
                      setFiltered([]);
                      setActiveIdx(-1);
                    }}
                  >
                    Go
                  </button>
                </div>

                {filtered.length > 0 && (
                  <ul className="mt-2 max-h-40 overflow-auto">
                    {filtered.map((s, i) => (
                      <li
                        key={s}
                        onClick={() => {
                          selectSuggestion(s);
                          setMobileOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg cursor-pointer ${i === activeIdx ? "bg-[rgba(236,72,153,0.06)]" : ""}`}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-4 overflow-auto pb-6">
              <nav aria-label="Mobile categories" className="space-y-2">
                {categoriesSample.map((cat) => (
                  <Disclosure key={cat.name} as="div" className="rounded-xl">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg focus:outline-none"
                          aria-expanded={open}
                        >
                          <span className="font-medium">{cat.name}</span>
                          <BiChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-2">
                          <ul className="space-y-1">
                            {cat.sub.map((sub) => (
                              <li key={sub.name}>
                                <div
                                  
                                  onClick={() =>{ setMobileOpen(false)
                                    chooseproduct(sub.to)
                                  }}
                                  className="block px-3 py-2 rounded-md"
                                >
                                  {sub.name}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </nav>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-center gap-3">
              
                <button
                  className="px-4 py-2 rounded-2xl text-sm font-medium"
                  onClick={() => {
                    setCartCount((c) => c + 1);
                    setMobileOpen(false);
                     navigate('/cart')
                  }}
                >Add to Cart
                  
                </button>
              </div>

              <div className="mt-3 border-t pt-3">
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-lg">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(99,102,241,0.12)]">
                    {user2?.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium">{user2?.name}</div>
                    <div className="text-xs text-slate-600">View Profile</div>
                  </div>
                </Link>
                {
                 !user2 && <button
                  onClick={() => {
                    // logout
                    setMobileOpen(false);
                    navigate('/login');
                  }}
                  className="w-full mt-3 px-3 py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Login
                </button>
                }
               {user2 && <button
                  onClick={() => {
                  handlelogout();
                    setMobileOpen(false);
                  }}
                  className="w-full mt-3 px-3 py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
                  }
              </div>
            </div>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
</div>


);
}