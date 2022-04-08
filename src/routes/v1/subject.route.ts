import { Router } from "express";
import { addSubject } from "../../controllers/subject.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("teacher"), addSubject);

export default router;
