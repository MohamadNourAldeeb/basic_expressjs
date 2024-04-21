import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import multer from "multer";
import router from "./routes/router.js";
import errorHandler from "./middleware/errorHandler.js";
import { limit } from "./utils/rate_limit.js";
const upload = multer({ dest: "uploads/" });

app.use(limit);
app.use(express.static("public"));
app.use(compression());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("server running at http://localhost:3000");
});
