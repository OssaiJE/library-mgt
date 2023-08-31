import path from 'path';
import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { engine } from 'express-handlebars';
import passport from 'passport';
import flash from 'connect-flash';
import nocache from 'nocache';
import connectDB from './config/database.js';
import router from './routes/libraryRoute.js';
import initializePassport from './config/passport.js';

const app = express();

config();
connectDB();
// startCronJob();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(nocache());
app.use(cors());
// Express session
app.use(
  session({
    secret: 'keyboard',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true },
  })
);
// Passport middleware
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Static folder
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the 'uploads' folder
app.use(express.static(path.join(__dirname, 'uploads')));


// Handle-bars extension and layout
app.engine(
  '.hbs',
  engine({
    defaultLayout: 'main',
    extname: '.hbs',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
);
app.set('view engine', '.hbs');
// app.set('views', './views');

app.set('trust proxy', true);

app.use('/', router);

app.use('/no-route', (req, res, next) => {
  next();
});

app.use('*', (req, res) => {
  return res.status(404).json({
    status: 404,
    message: 'No endpoint matches that URL'
  });
});

export default app;
