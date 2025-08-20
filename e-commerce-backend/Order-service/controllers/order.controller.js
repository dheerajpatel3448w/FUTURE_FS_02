import { Order } from "../models/order.model.js";
import User from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import Product from "../models/product.model.js";
export const createorder = async (req,res) => {
    
        const {address,carts,paymentMethod} = req.body;
        const user = req.user._id;
console.log(carts,user);
        const order = await Order.create({
            user,
            address,
            products: carts.map((item) => {
                return ({
                    product: item.productId._id, 
                    quantity: item.quantity,
                    price: item.productId.discountPrice || item.productId.price
                })
                
            }),
            paymentMethod,
            status:"pending",
            totalamount:carts.reduce((acc,item)=>acc+(item.productId.discountPrice||item.productId.price)*item.quantity,0),
            paymentStatus:"pending"
        })
        if(!order) {
            return res.status(400).json({ message: "Order creation failed" });
        }

        res.status(201).json({ message: "Order created successfully", order ,success:true});

    
}
export const getOrder = async (req, res) => {
    try {
        
        const user = req.user._id;
        console.log(user);
        const order = await Order.find({user:user}).populate("user address products.product");
        console.log(order);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getsingleorder = async(req,res) => {
    try {
        const { id } = req.params;
        const user = req.user._id;
        const order = await Order.findById({user,_id:id}).populate("user address products.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getallorderforadmin = async (req, res) => {
    try {
        const order = await Order.find().populate("user address products.product");
        res.status(200).json({ order, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const statuschangedforadmin = async(req,res) => {
    try {
        const { orderId ,status}= req.body
 let order;
        if(status=="delivered"){
             order = await Order.findByIdAndUpdate({ _id:orderId}, { status: status,paymentStatus:"paid"}, { new: true });
        }else{
          order = await Order.findByIdAndUpdate({ _id:orderId}, { status: status}, { new: true });
        }

        return res.status(200).json({ message: "Order status updated successfully", order, success: true });
    } catch (error) {
        res.status(200).json({message:error.message});
        
    }
  
}
