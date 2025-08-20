 import { Router } from "express";
import { verifytoken2 } from "../middlewares/verify.middleware.js";
import { createRating, deleteRating, updaterating,getRating } from "../controllers/rating.controller.js";

 const router2 = Router();

 router2.route('/rating/createrating').post(verifytoken2,createRating);
 router2.route('/rating/updaterating/:id').put(verifytoken2,updaterating);
 router2.route('/rating/deleterating/:id').delete(verifytoken2,deleteRating);
 router2.route('/rating/getrating/:id').get(verifytoken2, getRating);

 export default router2;