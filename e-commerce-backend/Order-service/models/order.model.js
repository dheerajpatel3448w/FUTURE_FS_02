import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    products :[
        {
        product : { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity:{
          type: Number,
        required: true,
        min:1
        },
        price:{
            type: Number,
            required: true,
            min: 0
        }
     }
    ],
    paymentMethod:{
        type: String,
        enum: ["cod"],
        required: true,
        default: "cod"
    },
    status:{
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    totalamount:{
        type: Number,
        required: true,
        min: 0,
    },
    paymentStatus:{
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    }


},{
    timestamps: true
})

export const Order = mongoose.model("Order", orderSchema);