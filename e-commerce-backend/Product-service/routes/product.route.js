
import { Router } from "express";
import { verifytoken2 } from "../middlewares/verify.middleware.js";
import { categoryProducts, categoryProducts2, createProduct, deleteProduct, getproducts, singleproduct, updateProduct } from "../controllers/product.controller.js";
import { adminverify } from "../middlewares/verify.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/getproduct').get(verifytoken2,getproducts);
router.route('/getproduct/:id').get(verifytoken2,singleproduct);
router.route('/createproduct').post(verifytoken2,adminverify,   upload.fields([
        {
            name: "images",
            maxCount: 5
    
        },
 ]),createProduct);
router.route('/updateproduct/:id').put(verifytoken2,adminverify,updateProduct);
router.route('/deleteproduct/:id').delete(verifytoken2,adminverify,deleteProduct);
router.route('/category').get(verifytoken2,categoryProducts2);
router.route('/category2').get(verifytoken2,categoryProducts);
export default router;