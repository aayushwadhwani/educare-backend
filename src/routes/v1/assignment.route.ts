import { Router } from "express";
import { addAssignment } from "../../controllers/assignment.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("teacher"), addAssignment);

export default router;
