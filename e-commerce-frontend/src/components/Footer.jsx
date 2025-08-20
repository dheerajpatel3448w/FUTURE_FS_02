/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, Fragment } from "react";
import { motion } from "framer-motion";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FiChevronUp } from "react-icons/fi";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const inputRef = useRef(null);
  const copyrightYear = new Date().getFullYear();

  const supportLinks = [
    { name: "Help Center", href: "#" },
    { name: "Track Order", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns & Refunds", href: "#" },
  ];

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Sustainability", href: "#" },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaLinkedin />, href: "#" },
  ];

  const paymentMethods = [
    { name: "Visa", svg: <svg className="w-8 h-6"><rect width="100%" height="100%" fill="#2563eb" /></svg> },
    { name: "Mastercard", svg: <svg className="w-8 h-6"><rect width="100%" height="100%" fill="#dc2626" /></svg> },
    { name: "PayPal", svg: <svg className="w-8 h-6"><rect width="100%" height="100%" fill="#facc15" /></svg> },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterStatus("error");
      return;
    }
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 1500);
  };

  const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "t") backToTop();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#FFEDD5] via-[#FDE68A] to-[#FBCFE8] text-gray-800 mt-16 rounded-t-2xl shadow-lg ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left: Brand & Social */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-3"
          >
            ShopEase
          </motion.h2>
          <p className="text-sm mb-4">Bringing comfort and joy to your shopping journey.</p>
          <div className="flex space-x-3">
            {socialLinks.map((s, idx) => (
              <motion.a
                key={idx}
                href={s.href}
                whileHover={{ scale: 1.2 }}
                className="p-2 rounded-full bg-gray-200/60 hover:bg-gray-300/70"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Middle: Accordions on mobile */}
        <div className="hidden md:block">
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            {companyLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.href} className="hover:underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:block">
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            {supportLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.href} className="hover:underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:hidden space-y-3">
          {[{title:"Company", links:companyLinks},{title:"Support", links:supportLinks}].map((sec, i)=>(
            <Disclosure key={i}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full px-3 py-2 rounded-lg bg-gray-200/60">
                    <span>{sec.title}</span>
                    <FiChevronUp className={`${open ? "rotate-180" : ""} transition`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-3 pt-2">
                    <ul className="space-y-2">
                      {sec.links.map((l, idx) => (
                        <li key={idx}>
                          <Link to={l.href} className="hover:underline block py-1">
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Right: Newsletter */}
        <div>
          <h3 className="font-semibold mb-3">Newsletter</h3>
          <form onSubmit={handleSubscribe} className="space-y-2 relative">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              ref={inputRef}
              id="email"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-100"
              aria-describedby="newsletter-feedback"
            />
            <button
              type="submit"
              disabled={newsletterStatus === "loading"}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-semibold shadow-md"
            >
              {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={newsletterStatus === "success" ? { opacity: 1, scale: 1 } : {}}
              className="absolute -top-8 right-0 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm"
              role="status"
              aria-live="polite"
            >
              {newsletterStatus === "success" && "Subscribed!"}
            </motion.div>
            {newsletterStatus === "error" && (
              <div id="newsletter-feedback" className="text-red-600 text-sm">
                Please enter a valid email.
              </div>
            )}
          </form>

          <Menu as="div" className="relative inline-block mt-4">
            <Menu.Button className="px-3 py-2 bg-gray-200/70 rounded-lg focus:outline-none">
              Language / Currency
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute mt-2 w-48 rounded-lg shadow-lg bg-white/70 backdrop-blur-sm focus:outline-none z-10">
                <div className="p-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`block w-full text-left px-2 py-1 rounded ${active ? "bg-gray-100" : ""}`}>
                        English / USD
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`block w-full text-left px-2 py-1 rounded ${active ? "bg-gray-100" : ""}`}>
                        हिन्दी / INR
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <div className="border-t border-gray-300/50 mt-8 py-6 px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm">&copy; {copyrightYear} ShopEase. All rights reserved.</p>
        <div className="flex space-x-3">
          {paymentMethods.map((p, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.1 }} className="rounded-md overflow-hidden">
              {p.svg}
            </motion.div>
          ))}
        </div>
        <div className="flex space-x-4 items-center">
          <Link to="#" className="text-sm hover:underline">Privacy Policy</Link>
          <Link to="#" className="text-sm hover:underline">Terms</Link>
          <motion.button
            onClick={backToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded-lg bg-pink-400 text-white shadow-md text-sm"
          >
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
