import fs from "fs";
import path from "path";
import multer from "multer";
import { nanoid } from "nanoid";


const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_CHAT_BYTES=10 * 1024 * 1024; 

const PROFILE_UPLOAD_DIR = path.join(process.cwd(), "uploads", "profile");

const mimeToExt = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const chatMimes = {
  "application/pdf": ".pdf",
  "text/plain": ".txt",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

const ensureUploadDir = () => {
  if (!fs.existsSync(PROFILE_UPLOAD_DIR)) {
    fs.mkdirSync(PROFILE_UPLOAD_DIR, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir();
    cb(null, PROFILE_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = mimeToExt[file.mimetype] || path.extname(file.originalname);
    cb(null, `${nanoid(16)}${ext || ".jpg"}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!mimeToExt[file.mimetype]) {
    const error = new Error("Only JPG, PNG, and WEBP images are allowed");
    error.statusCode = 400;
    return cb(error);
  }
  return cb(null, true);
};

export const profileImageUpload = multer({
  storage,
  fileFilter:imageFileFilter,
  limits: { fileSize: MAX_PROFILE_IMAGE_BYTES },
});

export const profileImageConfig = {
  maxBytes: MAX_PROFILE_IMAGE_BYTES,
  publicPrefix: "/uploads/profile",
};

/** CHAT MUTLER */

const makeChatFileFilter = (allowedMimes) => (req, file, cb) => {
  if (!allowedMimes[file.mimetype]) {
    const error = new Error("File type not allowed");
    error.statusCode = 400;
    return cb(error);
  }
  return cb(null, true);
};


export const chatUpload=multer({
  storage:multer.memoryStorage(),
  fileFilter:makeChatFileFilter(chatMimes),
  limits:{fileSize:MAX_CHAT_BYTES}

})
