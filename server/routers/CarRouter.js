import { Router } from "express";
import Interceptors from "../interceptors/index.js";
import { CarModule } from "../modules/index.js";

const router = Router();
router.get("/", Interceptors.verifyAccess, CarModule.getAllCars);
router.put("/:id", Interceptors.verifyAccess, CarModule.retryBooking);
router.delete("/:id", Interceptors.verifyAccess, CarModule.cancelBooking);
router.post("/newBooking", Interceptors.verifyAccess, CarModule.newBooking);
router.post("/confirmBooking", Interceptors.verifyAccess, CarModule.confirmBooking);

export default router;
