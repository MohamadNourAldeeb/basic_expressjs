import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import rateLimit from "express-rate-limit";
import compression from "compression";
import multer from "multer";
import router from "./routes/router.js";
import errorHandler from "./middleware/errorHandler.js";
import { limit } from "./utils/rate_limit.js";
const upload = multer({ dest: "uploads/" });

app.use(limit);
app.use(express.static("public", { maxAge: oneDay }));
app.use(compression());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(router);

// app.post("/upload", upload.single("file"), (req, res) => {
//     // File is available in req.file
//     res.send("File uploaded successfully.");
// });
// app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
//     // Files are available in req.files
//     res.send('Multiple files uploaded successfully.');
//   });

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("server running at http://localhost:3000");
});
