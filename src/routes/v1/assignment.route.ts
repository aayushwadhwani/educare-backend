import { Router } from "express";
import { addAssignment, assignmentMulter, getAssignment } from "../../controllers/assignment.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("teacher"), assignmentMulter.single("file"), addAssignment);
router.route("/:id").get(authorization, restrictTo("teacher"), getAssignment);

export default router;
