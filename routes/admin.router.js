import express from "express";
const router = express.Router();
import roleApi from "./admin/role.router.js";
import permissionApi from "./admin/permission.router.js";

// import userApi from "./admin/user.router.js";

router.use("/role", roleApi);
router.use("/permission", permissionApi);

// router.use("/user", userApi);

export default router;
