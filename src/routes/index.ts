import express from "express";
import routerV1 from "./v1";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json("educare API is running");
});

router.use("/api/v1", routerV1);

export default router;
