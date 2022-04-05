import { Router } from "express";
import multer from "multer";
import { restrictTo } from "../../middlewares/authorization";
import { authorization } from "../../middlewares/authorization";
import { addTeachers, uploadTeacherDataCsv } from "../../controllers/admin.controller";
const router = Router();

router.route("/").post(authorization, restrictTo("admin"), uploadTeacherDataCsv.single("file"), addTeachers);

export default router;
