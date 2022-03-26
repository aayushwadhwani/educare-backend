import express from "express";
import { addAdmin } from "../../controllers/admin.controller";

const router = express.Router();

router.route("/").post(addAdmin);

export default router;
