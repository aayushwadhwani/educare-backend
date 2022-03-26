import express from "express";
import { authorization, restrictTo } from "../../middlewares/authorization";
import { addAdmin } from "../../controllers/admin.controller";

const router = express.Router();

router.route("/").post(authorization, restrictTo("admin"), addAdmin);

export default router;
