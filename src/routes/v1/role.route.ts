import express from "express";
import { authorization, restrictTo } from "../../middlewares/authorization";
import { addRole, deleteRole, getAllRole, getSingleRole } from "../../controllers/role.controller";

const router = express.Router();

router.route("/").post(authorization, restrictTo("admin"), addRole).get(authorization, restrictTo("admin"), getAllRole);
router
    .route("/:id")
    .get(authorization, restrictTo("admin"), getSingleRole)
    .delete(authorization, restrictTo("admin"), deleteRole);

export default router;
