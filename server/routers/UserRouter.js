import { Router } from "express";
import Interceptors from "../interceptors/index.js";
import { UserModule } from "../modules/index.js";

const router = Router();

router.get("/", Interceptors.verifyAccess, UserModule.getDetails);
router.post("/update", Interceptors.verifyAccess, UserModule.updateUser);

export default router;
