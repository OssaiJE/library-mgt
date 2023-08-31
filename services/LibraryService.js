import User from '../database/models/UserModel.js';
import Book from '../database/models/BookModel.js';

class LibraryService {
  async registerUser(newUser) {
    const user = new User(newUser);
    await user.save();
    return user;
  }

  async getUser(userId) {
    const user = await User.findById(userId);
    console.log('getUser Service', user);

    return user;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email });

    return user;
  }

  async getBook(bookId) {
    const book = await Book.findById(bookId);

    return book;
  }

  async searchBook(keywords) {
    const books = await Book.find({
      status: { $in: ['public', 'private'] },
      $text: { $search: keywords }
    });

    return books;
  }

  async searchBookWithSpecialization(specialization, keywords) {
    const books = await Book.find({
      status: { $in: ['public', 'private'] },
      specialization,
      $text: { $search: keywords }
    });

    return books;
  }

  async getAllBooksHome() {
    const desiredStatuses = ['public', 'private'];
    const books = await Book.find({ status: { $in: desiredStatuses } })
      .sort({
        createdAt: -1
      })
      .limit(8);

    return books;
  }
  
  async getAllBooks() {
    const desiredStatuses = ['public', 'private'];
    const books = await Book.find({ status: { $in: desiredStatuses } }).sort({
      createdAt: -1
    });

    return books;
  }

  async getAllBooksByUserId(userId) {
    const books = await Book.find({ userId }).sort({ createdAt: -1 });

    return books;
  }

  async getBooksBySpecialization(specialization) {
    const books = await Book.find({ specialization: specialization.specialization }).sort(
      { createdAt: -1 }
    );

    return books;
  }

  async saveBook(newBook) {
    const book = new Book(newBook);
    await book.save();
    return book;
  }
}

export default LibraryService;
