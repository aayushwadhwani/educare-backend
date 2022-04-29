import { Router } from "express";
import { addSchedule, deleteSchedule, getSchedules } from "../../controllers/scheduler.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("teacher"), addSchedule);
router
    .route("/:id")
    .delete(authorization, restrictTo("teacher"), deleteSchedule)
    .get(authorization, restrictTo("teacher"), getSchedules);

export default router;
