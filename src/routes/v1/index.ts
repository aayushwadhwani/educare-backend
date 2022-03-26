import express from "express";
import adminRoute from "./admin.route";

const router = express.Router();

router.use("/admin", adminRoute);
router.get("/", (req, res) => {
    res.status(200).json({ message: "educare API is running" });
});

export default router;
