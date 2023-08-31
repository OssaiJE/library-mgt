import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../database/models/UserModel.js';

export default function configurePassport(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Match User
        let user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'User does not exist' });
        } else {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password is incorrect' });
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
}
