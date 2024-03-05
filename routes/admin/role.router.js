import express from "express";
const router = express.Router();
import roleVaildate from "../../utils/validations/admin/role.schema.js";
import roleController from "../../controllers/admin/role.controller.js";
import tryCatch from "../../utils/tryCatch.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import { permissions } from "../../utils/permissions.js";

router.post(
    "/add",
    authentication,
    authorization(permissions.admin.roles.create.value),
    roleVaildate,
    tryCatch(roleController.addRole)
);
router.delete(
    "/delete/:role_id",
    authentication,
    authorization(permissions.admin.roles.delete.value),
    tryCatch(roleController.deleteRole)
);
router.put(
    "/update/:role_id",
    authentication,
    authorization(permissions.admin.roles.update.value),
    roleVaildate,
    tryCatch(roleController.updateRole)
);
router.get(
    "",
    authentication,
    authorization(permissions.admin.roles.getAll.value),
    tryCatch(roleController.getAllRoles)
);

export default router;
