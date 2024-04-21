import express from "express";
const router = express.Router();
import authApi from "./auth.router.js";
// import homeApi from "./home.router.js";
import adminApi from "./admin.router.js";

router.use("/auth", authApi);
router.use("/admin", adminApi);
// router.use("/", homeApi);
router.use("*", (req, res) => {
    res.status(404).send("The URL is not correct ");
});
export default router;
