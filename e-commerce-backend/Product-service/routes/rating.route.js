 import { Router } from "express";
import { verifytoken2 } from "../middlewares/verify.middleware.js";
import { createRating, deleteRating, updaterating } from "../controllers/rating.controller.js";

 const router2 = Router();

 router2.route('/createrating').post(verifytoken2,createRating);
 router2.route('/updaterating/:id').put(verifytoken2,updaterating);
 router2.route('/deleterating/:id').delete(verifytoken2,deleteRating);

 export default router2;