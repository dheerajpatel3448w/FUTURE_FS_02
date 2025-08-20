import Product  from "../models/product.model.js"
import { Rating } from "../models/rating.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";

export const getproducts= async (req,res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    if(!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({
        message: "Products fetched successfully",
        products: products,
        currentPage: page,
        totalProducts: await Product.countDocuments(),
        totalPages: Math.ceil(await Product.countDocuments() / limit)
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

export const singleproduct = async (req,res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({_id:productId});
        console.log(product);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const rating = await Rating.find({product: productId});
        const averageRating = rating.reduce((acc, curr) => acc + curr.rating, 0) / rating.length || 0;
        const totalReviews = rating.length;
       const product2 = await Product.findByIdAndUpdate(productId,{
        reviews:totalReviews,
        rating:averageRating
       },{
        new: true
       })


        res.status(200).json({
            message: "Product fetched successfully",
            product: product2
        });
    } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).json({ message: "Failed to fetch product" });
        
    }
}
export const createProduct = async (req, res) => {
    
      const { 
  title, 
  description, 
  category, 
  price, 
  discountPrice, 
  availability, 
  stock, 

  features,          // array
     // object
        // array of URLs
} = req.body;


  
        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const image = await Promise.all( req.files.images.map(async (file) => {
   return await file.path; 
}))

const imageurl =  await Promise.all(image.map(async res2 =>{
    return await uploadoncloudinary(res2);
}))
console.log(imageurl);

        const newProduct = await Product.create({
            title,
            description,
            price,
            category,
            images: imageurl,
            discountPrice,
            features,
            
            stock,
            availability:true,
        }); 
        console.log(newProduct);
        if(!newProduct){
            return res.status(400).json({ message: "Failed to create product" });
        }
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });
    
}
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, description, price, category, image } = req.body;
        if (!title || !description || !price || !category || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            title,
            description,
            price,
            category,
            image
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product" })
    }
}

export const categoryProducts = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const products = await Product.find({
  search: { $elemMatch: { $regex: category, $options: "i" } }
}).skip(skip).limit(limit);

    console.log(products,"1");
    if(!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({
        message: "Products fetched successfully",
        products: products,
        currentPage: page,
        totalProducts: await Product.countDocuments({
  search: { $elemMatch: { $regex: category, $options: "i" } }
}),
        totalPages: Math.ceil(await Product.countDocuments({
  search: { $elemMatch: { $regex: category, $options: "i" } }
}) / limit)
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
export const categoryProducts2 = async (req, res) => {

  try {

    const category = req.query.category;
    console.log(category);
   const products = await Product.find({
  search: { $elemMatch: { $regex: category, $options: "i" } }
}).limit(10);

    console.log(products);
    if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }
    
    res.status(200).json({
        message: "Products fetched successfully",
        products: products,
       
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}