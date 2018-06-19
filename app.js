var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"), //npm install body-parser --save (to convert JSON to javascript objects)
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    methodOverride = require("method-override"),
    flash                   = require("connect-flash"),
    // passportLocalMongoose   = require("passport-local-mongoose"),//maybe just put in user.js
    User                    = require("./models/user"),
    // Comment                 = require("./models/comment"), //(js is implicit)
    // Campground              = require("./models/campground"), // campground.js (js is implicit)
    seedDB                  = require("./seeds"); // to delete all database entries and create samples

// pour référer aux fichiers js qu'on a mis dans le folder routes
var campgroundRoutes        = require("./routes/campgrounds"),
    commentRoutes           = require("./routes/comments"),
    indexRoutes             = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true})); //convert JSON to javascript objects
app.use(express.static(__dirname + "/public")); //This is the directory to my CSS files that will be used by my ejs
app.set("view engine", "ejs"); //Permet de ne pas avoir a ajouter l'extension ejs dans les futur "res.render (filename.ejs);"
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "blablabalalbalb",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass user information automatically to all the configured routes in the currentUser variable
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); // pass the content of the flash error message on all routes
    res.locals.success = req.flash("success"); // pass the content of the flash success message on all routes
    next();
});

//pour utiliser nos fichiers dans le folder routes // attention à l'ordre: doit être placé après notre fonction qui passe currentUser parce que ces routes l'utilisent
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); //all campground routes start with /campground so this will append it automatically
app.use("/campgrounds/:id/comments", commentRoutes);

// POPULATE THE DATABASE WITH SAMPLE CAMPGROUNDS
// seedDB(); // Remove all database entries and create a few new ones

app.listen(process.env.PORT, process.env.IP, function(){ //Habituellement le vrai port.  Ici c'est le standard pour Cloud 9.  Doit toujours être mis à la fin de app.js sinon rien ne marche.
    console.log("The YelpCamp server is started!!!");
});