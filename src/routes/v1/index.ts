import express from "express";
import adminRoute from "./admin.route";
import authRoute from "./auth.route";
import roleRoute from "./role.route";
import teacherRoute from "./teacher.route";
import studentRoute from "./student.route";

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/role", roleRoute);
router.use("/teacher", teacherRoute);
router.use("/student", studentRoute);
router.get("/", (req, res) => {
    res.status(200).json({ message: "educare API is running" });
});

export default router;
