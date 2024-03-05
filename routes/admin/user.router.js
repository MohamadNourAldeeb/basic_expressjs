// import express from "express";
// const router = express.Router();
// import userController from "../../controllers/admin/user.controller.js";
// import tryCatch from "../../utils/tryCatch.js";
// import authentication from "../../middleware/authentication.js";
// import authorization from "../../middleware/authorization.js";
// import { permissions } from "../../utils/permissions.js";

// router.delete(
//     "/delete/:user_id",
//     authentication,
//     authorization(permissions.admin.users.delete.value),
//     tryCatch(userController.deleteUser)
// );

// router.get(
//     "",
//     authentication,
//     authorization(permissions.admin.users.getAll.value),
//     tryCatch(userController.getAllUser)
// );

// export default router;
