import multer from "multer";
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true); // Accepts these file types
    } else {
        cb(null, false); // Rejects other file types
    }
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // sets the destination for file uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limits file size to 5MB
    },
    fileFilter: fileFilter,
});

export default upload;
