import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
     search:[
        {
            type: String,
            required: true
        }
     ],
    images: [
       {
         type: String,
       
       }
    ],
    availability: {
        type: String,
        enum: ["in-stock", "out-of-stock"],
        default: "in-stock"
    },
    rating: {
        type: Number,
        
    },
    reviews: {
        type:String,

    },
    stock:{
        type:Number
    },
     features: [       
        { 
            type: String

        }
    ],
    search:[
        {
            type: String,
            required: true
        }
    ],
    
    discountPrice:{
        type:Number
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product
