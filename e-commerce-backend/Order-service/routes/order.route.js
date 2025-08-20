import { Router } from "express";
import { adminverify, verifytoken4 } from "../middlewares/verify.middleware.js";
import { createorder, getallorderforadmin, getOrder, getsingleorder, statuschangedforadmin } from "../controllers/order.controller.js";
const router = Router();

router.route("/createorder").post(verifytoken4,createorder);
router.route("/getorder").get(verifytoken4,getOrder);
router.route("/getsingleorder/:id").get(verifytoken4,getsingleorder);
router.route("/admingetorder").get(verifytoken4,adminverify,getallorderforadmin);
router.route("/statuschanged").post(verifytoken4,adminverify,statuschangedforadmin);

export default router;