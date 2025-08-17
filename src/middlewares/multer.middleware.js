import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/temp"); // Set the destination for uploaded files
  },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({
  storage,}
  );