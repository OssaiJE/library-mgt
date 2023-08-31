import { Schema, model } from 'mongoose';

// Book Model
const bookSchema = new Schema(
  {
    booktitle: {
      type: String
    },
    author: {
      type: String
    },
    specialization: {
      type: String
    },
    isbn: {
      type: String
    },
    year: {
      type: String
    },
    publisher: {
      type: String
    },
    summary: {
      type: String
    },
    status: {
      type: String,
      enum: ['public', 'private', 'draft'],
      default: 'public'
    },
    availability: {
      type: String,
      enum: ['digital', 'physical'],
      default: 'digital'
    },
    coverimage: {
      type: String
    },
    bookpath: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);
bookSchema.index({ booktitle: 'text' });
const Book = model('Book', bookSchema);

export default Book;
