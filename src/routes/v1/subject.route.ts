import { Router } from "express";
import { addSubject, deleteSubject, getSubjectById, getSubjects } from "../../controllers/subject.controller";
import { authorization, restrictTo } from "../../middlewares/authorization";

const router = Router();

router
    .route("/")
    .post(authorization, restrictTo("teacher"), addSubject)
    .get(authorization, restrictTo("teacher"), getSubjects);

router
    .route("/:id")
    .get(authorization, restrictTo("teacher"), getSubjectById)
    .delete(authorization, restrictTo("teacher"), deleteSubject);
export default router;
