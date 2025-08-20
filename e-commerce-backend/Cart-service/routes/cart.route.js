import { Router } from "express";
import { verifytoken3 } from "../middlewares/verify.middleware.js";
import { createcart, deletecart, getcart, updatecart,updatequantity ,deleteallcart} from "../controllers/cart.controller.js";

const router = Router();

router.route('/createcart').post(verifytoken3,createcart);
router.route('/getcart').get(verifytoken3, getcart);
router.route('/deletecart/:productId').delete(verifytoken3, deletecart);
router.route('/updatecart/:productId').put(verifytoken3, updatecart);
router.route('/deleteallcart').delete(verifytoken3, deleteallcart);
router.route('/updatequantity').put(verifytoken3, updatequantity);

export default router;