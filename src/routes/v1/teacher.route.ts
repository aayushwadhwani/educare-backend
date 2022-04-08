import { Router } from "express";
import multer from "multer";
import { restrictTo } from "../../middlewares/authorization";
import { authorization } from "../../middlewares/authorization";
import { addTeachers, uploadTeacherDataCsv } from "../../controllers/admin.controller";
import { classDataCsv, createClass, deleteClass, getAllClass } from "../../controllers/class.controller";
const router = Router();

router.route("/").post(authorization, restrictTo("admin"), uploadTeacherDataCsv.single("file"), addTeachers);
router
    .route("/class")
    .post(authorization, restrictTo("teacher"), classDataCsv.single("file"), createClass)
    .get(authorization, restrictTo("teacher"), getAllClass);

router.route("/class/:id").delete(authorization, restrictTo("teacher"), deleteClass);

export default router;
