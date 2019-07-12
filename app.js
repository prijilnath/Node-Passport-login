const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

//DB Config
const db = require('./config/keys').MongoURI;

//passport config
require('./config/passport')(passport);

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, authSource: 'admin' })
        .then(() => console.log('Mongodb connected...'))
        .catch(err => console.log('error' + err))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
        session({
                secret: 'secret',
                resave: true,
                saveUninitialized: true
        })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));