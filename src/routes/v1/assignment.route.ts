import { Router } from "express";
import { addAssignment, assignmentMulter } from "../../controllers/assignment.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("teacher"), assignmentMulter.single("file"), addAssignment);

export default router;
