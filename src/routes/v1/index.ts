import express from "express";
import adminRoute from "./admin.route";
import authRoute from "./auth.route";
import roleRoute from "./role.route";

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/role", roleRoute);
router.get("/", (req, res) => {
    res.status(200).json({ message: "educare API is running" });
});

export default router;
