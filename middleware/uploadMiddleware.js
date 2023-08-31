import path from 'path';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

/* multer storage object */
const storage = multer.diskStorage({
  destination(
    req,
    file,
    cb
  ) {
    const uploadPath = 'uploads';
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename(
    req,
    file,
    cb
  ) {
    cb(
      null,
      `${file.originalname.replace(/\s+/g, '_')}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|docx|doc|pdf|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

/* multer object used to upload files. */
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 20 //20MB
  }
});

/**
 * If there's an error, return a 413 status code with the error message.
 * @returns  fileErrorHandler.
 */
const fileErrorHandler = (
  err,
  req,
  res,
  next
) => {
  if (err) {
    return failure(413, err.message, res);
  } else {
    next();
  }
};

export { fileErrorHandler, upload };
