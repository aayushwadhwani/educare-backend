import { Router } from "express";
import { addSchedule, deleteSchedule } from "../../controllers/scheduler.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("teacher"), addSchedule);
router.route("/:id").delete(authorization, restrictTo("teacher"), deleteSchedule);

export default router;
