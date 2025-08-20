import { Rating } from "../models/rating.model.js";
import User from "../models/user.model.js";

export const createRating = async (req, res) => {
    try {
        const { productId, rating ,comment} = req.body;
        const userId = req.user._id;
        console.log(rating,comment);
        if (!productId || !userId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newRating1 = await Rating.create({
            product: productId,
            user: userId,
            comment,
            rating
        });
        const newRating = await Rating.findById(newRating1._id).populate("user");
        console.log(newRating);
        res.status(201).json({
            message: "Rating created successfully",
            rating: newRating
        });
    } catch (error) {
        console.error("Error creating rating:", error);
        res.status(500).json({ message: "Failed to create rating" });
    }
}
export const updaterating = async (req, res) => {
    try {
        const { ratingId, rating, comment } = req.body;
        if (!ratingId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedRating = await Rating.findByIdAndUpdate(ratingId, { rating, comment }, { new: true });
        if (!updatedRating) {
            return res.status(404).json({ message: "Rating not found" });
        }
        res.status(200).json({
            message: "Rating updated successfully",
            rating: updatedRating
        });
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ message: "Failed to update rating" });
    }   
}
export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        if (!ratingId) {
            return res.status(400).json({ message: "Rating ID is required" });
        }
        const deletedRating = await Rating.findByIdAndDelete(ratingId);
        if (!deletedRating) {
            return res.status(404).json({ message: "Rating not found" });
        }
        res.status(200).json({
            message: "Rating deleted successfully",
            rating: deletedRating
        });
    } catch (error) {
        console.error("Error deleting rating:", error);
        res.status(500).json({ message: "Failed to delete rating" });
    }
}


export const getRating = (req,res) => {
    const { id } = req.params;
    Rating.find({ product: id })
        .populate("user")
        .then(ratings => {
            console.log(ratings);

            res.status(200).json({
                message: "Ratings fetched successfully",
                ratings
            });
        })
        .catch(error => {
            console.error("Error fetching ratings:", error);
            res.status(500).json({ message: "Failed to fetch ratings" });
        });
}
