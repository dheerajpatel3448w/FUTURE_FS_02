/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { HiPlus, HiTrash, HiPhotograph, HiCheck } from "react-icons/hi";
import axios from "axios";

// Single-file CreateProduct page component (copy-paste ready for Vite/CRA + TailwindCSS + framer-motion)
// Requirements: TailwindCSS & framer-motion installed. react-hook-form and react-icons recommended.

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      discountPrice: "",
      availability: "in-stock",
      stock: 0,
      
    },
  });

  const [features, setFeatures] = useState(["Active Noise Cancellation"]);
  const featureRef = useRef(null);

 
  const [images, setImages] = useState([]); // store { file, url }
  const imageInputRef = useRef(null);

  function onAddFeature(e) {
    e.preventDefault();
    const v = featureRef.current?.value?.trim();
    if (v && !features.includes(v)) {
      setFeatures((s) => [...s, v]);
      featureRef.current.value = "";
    }
  }

  function onRemoveFeature(idx) {
    setFeatures((s) => s.filter((_, i) => i !== idx));
  }

 

 

  function handleImageFiles(files) {
    const arr = Array.from(files).slice(0, 6); // limit
    const readers = arr.map((file) => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (ev) => res({ file, url: ev.target.result });
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((imgs) => setImages((s) => [...s, ...imgs]));
  }

  function onRemoveImage(idx) {
    setImages((s) => s.filter((_, i) => i !== idx));
  }

  function onResetForm() {
    reset();
    setFeatures(["Active Noise Cancellation"]);
    
    setImages([]);
  }

  function onSubmit(data) {
    // Build final product object
      const formData = new FormData();

  // Append normal text fields
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("discountPrice", data.discountPrice);
  formData.append("availability", data.availability);
  formData.append("stock", data.stock);


  // Convert arrays/objects to JSON strings
  formData.append("features", JSON.stringify(features));


  // Append actual images (File objects)
  images.forEach((img) => {
    formData.append("images", img.file); 
  });
    console.log("Submitting product:", formData.get(images));
      axios.post(`${import.meta.env.VITE_API_URL_PRODUCT}/product/createproduct`, formData, {
        withCredentials:true,
        headers:{
            Authorization:`Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            "Content-Type": "multipart/form-data",
        }
      }).then(()=>{
        alert("Product created successfully!");
      }).catch((error) => {
        console.error("Error creating product:", error);
        alert("Failed to create product.");
      });
    // Replace this with API call
    console.log("Create product payload:", formData);

    // Fancy success micro-animation
    setTimeout(() => {
      onResetForm();
      alert("Product created (mock). Check console for payload.");
    }, 400);
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#FFFBF0] via-[#FEF3C7] to-[#FDECEF]">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Create Product — Admin
          </h1>
         
        </motion.header>

        <div className="grid grid-cols-12 gap-6">
          {/* Form column */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="col-span-12 lg:col-span-7 bg-clip-padding backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-md"
          >
            <section className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Title</span>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Premium Wireless Headphones"
                  className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                />
                {errors.title && (
                  <small className="text-red-600">{errors.title.message}</small>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Description</span>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={4}
                  className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                  placeholder="Short but meaningful description..."
                />
                {errors.description && (
                  <small className="text-red-600">{errors.description.message}</small>
                )}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Category</span>
                  <input
                    {...register("category")}
                    placeholder="Electronics"
                    className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Availability</span>
                  <select
                    {...register("availability")}
                    className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="in-stock">In stock</option>
                    <option value="out-of-stock">Out of stock</option>
                    <option value="preorder">Pre-order</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <label>
                  <span className="text-sm font-semibold text-gray-700">Price ($)</span>
                  <input
                    {...register("price", { required: true })}
                    type="number"
                    step="0.01"
                    className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-gray-700">Discount Price ($)</span>
                  <input
                    {...register("discountPrice")}
                    type="number"
                    step="0.01"
                    className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-gray-700">Stock</span>
                  <input
                    {...register("stock")}
                    type="number"
                    className="mt-2 block w-full rounded-lg border-0 p-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-300"
                  />
                </label>

               
              </div>

              {/* Features */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                  <form onSubmit={onAddFeature} className="flex items-center gap-2">
                    <input
                      ref={featureRef}
                      placeholder="Add feature (press +)"
                      className="rounded-lg p-2 ring-1 ring-gray-200 text-sm"
                    />
                    <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-indigo-600 text-white shadow hover:brightness-95" onClick={onAddFeature}>
                      <HiPlus /> <span className="text-sm">Add</span>
                    </button>
                  </form>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <motion.span
                      key={f + i}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-gray-200"
                    >
                      <span className="text-sm text-gray-800">{f}</span>
                      <button type="button" onClick={() => onRemoveFeature(i)} title="Remove" className="text-red-600">
                        <HiTrash />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
  

             

              {/* Images */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Images</h3>
                  <div className="flex items-center gap-2">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageFiles(e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-600 text-white shadow hover:brightness-95"
                    >
                      <HiPhotograph /> Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-red-50 text-red-700 ring-1 ring-red-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-3">
                  {images.length === 0 && (
                    <div className="col-span-3 md:col-span-6 rounded-xl border-dashed border-2 border-gray-200 p-6 text-center">
                      <p className="text-sm text-gray-500">No images yet — upload up to 6</p>
                    </div>
                  )}

                  {images.map((img, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} className="relative rounded-xl overflow-hidden">
                      <img src={img.url} alt={`upload-${i}`} className="w-full h-28 object-cover" />
                      <button onClick={() => onRemoveImage(i)} className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow">
                        <HiTrash />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-indigo-600 text-white font-semibold shadow hover:brightness-95">
                  <HiCheck /> Create Product
                </button>

                <button type="button" onClick={onResetForm} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-gray-100 text-gray-800 ring-1 ring-gray-200">
                  Reset
                </button>

                <div className="ml-auto text-sm text-gray-500">Draft mode — no network save (mock)</div>
              </div>
            </section>
          </motion.form>

          {/* Preview Column */}
          
        </div>
      </div>
    </div>
  );
}

// Small helper component to read inputs for live preview (non-react-hook-form linked preview)
