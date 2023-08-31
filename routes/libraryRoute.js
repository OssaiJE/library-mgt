import express from 'express';
import {
  allBooks,
  authSpecialization,
  getBook,
  getBookSpecialization,
  getHome,
  getLogin,
  getMyBooks,
  getPublish,
  getSpecialization,
  loginUser,
  logoutUser,
  publishBook,
  registerUser,
  searchBooks
} from '../controllers/LibraryController.js';
import { fileErrorHandler, upload } from '../middleware/uploadMiddleware.js';
import tryCatch from '../utilities/tryCatch.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();
router.get('/', tryCatch(getHome));
router.get('/auth', tryCatch(getLogin));
router.get('/logout', tryCatch(logoutUser));
router.get('/specialization', tryCatch(getSpecialization));
router.get('/search', tryCatch(searchBooks));
router.post('/auth', tryCatch(loginUser));
router.post('/signup', tryCatch(registerUser));
router.get('/books', ensureAuthenticated, tryCatch(allBooks));
router.get('/book/:id', ensureAuthenticated, tryCatch(getBook));
router.get('/mybooks', ensureAuthenticated, tryCatch(getMyBooks));
router.get('/authspecialization', ensureAuthenticated, tryCatch(authSpecialization));
router.get('/authspec', ensureAuthenticated, tryCatch(getBookSpecialization));
router.get('/publish', ensureAuthenticated, tryCatch(getPublish));
router.post(
  '/publish',
  ensureAuthenticated,
  upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'coverimage', maxCount: 1 }
  ]),
  fileErrorHandler,
  tryCatch(publishBook)
);

export default router;
