import express from "express";
import routerV1 from "./v1";
import successResponse from "../response/Success";

const router = express.Router();

router.get("/", (req, res) => {
    const data = { message: "educare API is running" };
    const response = successResponse(data);
    res.status(response.status.code).json(response);
});

router.use("/api/v1", routerV1);

export default router;
