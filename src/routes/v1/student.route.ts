import { Router } from "express";
import { addStudents, uploadStudentDataCsv } from "../../controllers/admin.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router.route("/").post(authorization, restrictTo("admin"), uploadStudentDataCsv.single("file"), addStudents);

export default router;
