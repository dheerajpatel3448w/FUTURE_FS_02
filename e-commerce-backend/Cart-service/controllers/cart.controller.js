import { Cart } from "../models/cart.model.js";
import Product from "../models/product.model.js";
export const createcart = async(req,res) => {
    try {
        const userId = req.user._id;
        const {productId, quantity} = req.body;
        console.log(productId);
        console.log(quantity);
        if( !productId || !quantity ) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            });
        }

        const cart = await Cart.create({
            userId,
            productId,
            quantity
        })
        if(!cart) {
            return res.status(400).json({
                success: false,
                message: "Failed to create cart"
            });
        }

        return res.status(200).json({
            cart,
            success:true,
        message:"Cart created successfully"
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
export const getcart = async (req,res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.find({ userId })
         const cart2 = await Cart.find({ userId }).populate("productId");
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
              console.log(cart);
              console.log(cart2);
        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
export const updatecart = async (req,res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId, productId },
            { quantity },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}   
export const deletecart = async (req,res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const cart = await Cart.findOneAndDelete({ userId, _id: productId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
export const deleteallcart = async (req,res )=> {
    try {
        const userId = req.user._id;

        const cart = await Cart.deleteMany({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "All cart items deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
export const updatequantity = (req,res) => {
    
    try {
        const { productId, quantity } = req.body;
        console.log(productId,quantity);
        const userId = req.user._id;
        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            });
        }

        Cart.findOneAndUpdate(
            { _id:productId },
            { quantity },
            { new: true }
        ).then(updatedCart => {
            if (!updatedCart) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found"
                });
            }
            res.status(200).json({
                success: true,
                cart: updatedCart
            });
        }).catch(error => {
            res.status(500).json({
                success: false,
                message: error.message
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
  
}
