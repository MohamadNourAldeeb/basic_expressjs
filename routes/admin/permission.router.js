import express from "express";
const router = express.Router();
import roleVaidate from "../../utils/validations/admin/role.schema.js";
import PermissionController from "../../controllers/admin/permission.controller.js";
import tryCatch from "../../utils/tryCatch.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { permissions } from "../../utils/permissions.js";

router.put(
    "/update/:role_id",
    authentication,
    authorization(permissions.admin.permissions.update.value),
    roleVaidate,
    tryCatch(PermissionController.updatePermission)
);
router.get(
    "",
    authentication,
    authorization(permissions.admin.permissions.getAll.value),
    tryCatch(PermissionController.getAllPermissions)
);

export default router;
