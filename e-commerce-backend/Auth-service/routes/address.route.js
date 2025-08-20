import { Router } from "express";
import { verifyToken } from "../middlewares/user.middleware.js";
import { AddressDelete, Addressenter ,getaddress} from "../controllers/address.controller.js";

const router2 = Router();

router2.route('/address/address').post(verifyToken,Addressenter);
router2.route("/address/deleteaddress/:id").delete(verifyToken,AddressDelete);
router2.route("/address/getaddress").get(verifyToken,getaddress);

export default router2;