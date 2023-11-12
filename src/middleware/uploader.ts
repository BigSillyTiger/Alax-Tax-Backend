import multer from "multer";
import fs from "fs";
import path from "path";

// Directory where images will be stored
const storageDir = path.join(__dirname, "../..", "/public/logo");

// Ensure the storage directory exists
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storageDir);
    },
    filename: function (req, file, cb) {
        // You can use the original name, or add a timestamp, etc.
        // Here, I append the current timestamp to the original name
        cb(null, Date.now() + "-" + file.originalname);
        //cb(null, "logo" + path.extname(file.originalname));
    },
});

const uploadMW = multer({ storage: storage });

export default uploadMW;
