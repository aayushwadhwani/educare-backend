import express from "express";
import adminRoute from "./admin.route";
import authRoute from "./auth.route";

const router = express.Router();

router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.get("/", (req, res) => {
    res.status(200).json({ message: "educare API is running" });
});

export default router;
