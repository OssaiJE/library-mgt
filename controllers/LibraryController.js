import fs from 'fs';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import LibraryService from '../services/LibraryService.js';

const libraryService = new LibraryService();

export const getHome = async (req, res) => {
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  const books = await libraryService.getAllBooksHome();
  res.render('home', { books, student, staff, librarian, layout: 'private' });
};

export const getLogin = async (req, res) => {
  res.render('auth');
};

export const loginUser = async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/auth',
    failureFlash: true
  })(req, res, next);
};

export const logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth');
  });
};

export const registerUser = async (req, res) => {
  const { fullname, email, password, regno, usertype } = req.body;
  let errors = [];
  // Check required fields
  if (!fullname || !email || !password || !regno || !usertype) {
    errors.push({ msg: 'Please fill in all fields.' });
  }
  // Check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters.' });
  }

  if (errors.length > 0) {
    res.render('auth', {
      errors,
      fullname,
      email,
      password,
      regno,
      usertype
    });
  } else {
    // Validation passed
    let user = await libraryService.getUserByEmail(email.toLowerCase());

    if (user) {
      // User exists
      errors.push({ msg: 'Email is already registered.' });
      res.render('auth', {
        errors,
        fullname,
        email,
        password,
        regno,
        usertype
      });
    } else {
      const newUser = {
        fullname,
        email,
        password,
        regno,
        usertype
      };

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await libraryService.registerUser(newUser);
      req.flash('success_msg', 'Registration successful, now login!');
      res.redirect('/auth');
    }
  }
};

export const getSpecialization = async (req, res) => {
  res.render('specialization');
};

export const searchBooks = async (req, res) => {
  const keywords = req.query.keywords || '';
  const specialization = req.query.specialization || 'All Specialization';
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  let searchResults = [];
  if (specialization === 'All Specialization') {
    // Query books by keywords only
    searchResults = await libraryService.searchBook(keywords);
  } else {
    // Query books by both keywords and specialization
    searchResults = await libraryService.searchBookWithSpecialization(
      specialization,
      keywords
    );
  }
  console.log('USER DATA');
  console.log({ user: req.user });
  console.log('BEFOIR');
  console.log(searchResults);
  res.render('searchresult', {
    searchResults,
    keywords,
    specialization,
    student,
    staff,
    librarian,
    layout: 'private'
  });
};

// PROTECTED ROUTES

export const allBooks = async (req, res) => {
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  const books = await libraryService.getAllBooks();
  res.render('books', { books, student, staff, librarian, layout: 'private' });
};

export const getMyBooks = async (req, res) => {
  const userId = req.user._id;
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  const books = await libraryService.getAllBooksByUserId(userId);

  res.render('users/mybooks', { books, student, staff, librarian, layout: 'private' });
};

export const getBookSpecialization = async (req, res) => {
  const specialization = req.query;
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  const books = await libraryService.getBooksBySpecialization(specialization);
  const booksp = specialization.specialization;
  res.render('bookspec', { books, booksp, student, staff, librarian, layout: 'private' });
};

export const getBook = async (req, res) => {
  const bookId = req.params.id;
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  const {
    _id,
    booktitle,
    author,
    specialization,
    isbn,
    year,
    publisher,
    summary,
    status,
    availability,
    coverimage,
    bookpath
  } = await libraryService.getBook(bookId);

  res.render('users/bookdetails', {
    _id,
    booktitle,
    author,
    specialization,
    isbn,
    year,
    publisher,
    summary,
    status,
    availability,
    coverimage,
    bookpath,
    student,
    staff,
    librarian,
    layout: 'private'
  });
};

export const authSpecialization = async (req, res) => {
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  res.render('specialization', { student, staff, librarian, layout: 'private' });
};

export const getPublish = async (req, res) => {
  let usertype;
  if (req.user) {
    usertype = req.user.usertype;
  }
  let student;
  let staff;
  let librarian;
  if (usertype == 'student') {
    student = true;
  }
  if (usertype == 'staff') {
    staff = true;
  }
  if (usertype == 'librarian') {
    librarian = true;
  }
  res.render('users/publish', { student, staff, librarian, layout: 'private' });
};

export const publishBook = async (req, res) => {
  const { body } = req;
  let userId = req.user._id;
  let bookpath;
  let coverimage = 'cover/default_book_cover.jpg';
  if (req.files) {
    if (req.files['book']) {
      bookpath = req.files['book'][0].filename;
    }
    if (req.files['coverimage']) {
      // Resize the coverimage using sharp
      await sharp(`uploads/${req.files['coverimage'][0].filename}`)
        .resize(260, 400)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/cover/${req.files['coverimage'][0].filename}`);
      coverimage = `cover/${req.files['coverimage'][0].filename}`;
    }
  }

  const newBook = { ...body, bookpath, coverimage, userId };
  //   console.log({ newBook });
  const book = await libraryService.saveBook(newBook);
  req.flash('success_msg', 'Book successfully published');
  res.redirect('/mybooks');
};
