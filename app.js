const express          = require('express'),
      expressSanitizer = require('express-sanitizer'),
      app              = express(),
      mongoose         = require('mongoose'),
      flash            = require('connect-flash'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      methodOverride   = require('method-override'),
      User             = require('./models/user'),
      Announcement     = require('./models/announcement');

// REQUIRING ROUTES
const indexRoutes        = require('./routes/index'),
      adminRoutes        = require('./routes/admin'),
      userRoutes         = require('./routes/user'),
      announcementRoutes = require('./routes/announcement');

mongoose.connect(process.env.DBURL);
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
   secret: 'Greetings netizens. Your overlord has arrived.',
   resave: false,
   saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use(indexRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/announcements', announcementRoutes);

app.listen(process.env.PORT);