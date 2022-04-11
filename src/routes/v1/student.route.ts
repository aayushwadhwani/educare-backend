import { Router } from "express";
import { addStudents, getStudents, uploadStudentDataCsv } from "../../controllers/admin.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router
    .route("/")
    .post(authorization, restrictTo("admin"), uploadStudentDataCsv.single("file"), addStudents)
    .get(authorization, restrictTo("teacher"), getStudents);

export default router;
