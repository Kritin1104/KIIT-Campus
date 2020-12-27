const { session } = require("passport");

//require dotenv
require('dotenv').config()

// //mongodDB atlas
// mongodb+srv://Admin1104:<password>@cluster0.ogvqh.mongodb.net/<dbname>?retryWrites=true&w=majority


var express         =require("express"),
    app16            =express(),
    bodyParser      =require("body-parser"),
    mongoose        =require("mongoose"),
    flash           =require("connect-flash"),
    passport        =require("passport"),
    LocalStrategy   =require("passport-local"),
    methodOverride  =require("method-override"),
    Campground      =require("./models/campground.js"),
    Comment         =require("./models/comment.js"),
    User            =require("./models/user.js");
    // seedDB          =require("./seeds.js");

var dbUrl=process.env.DB_URL;
    
//requiring routes    
var commentRoutes       =require("./routes/comments.js"),
    campgroundRoutes    =require("./routes/campgrounds.js"),
    indexRoutes         =require("./routes/index.js");

//---------connect to DB-> kiit_campus DB is created if it does not already exists-------
//COMPULSORY LINE 1
mongoose.set('useUnifiedTopology', true);
//COMPULSORY LINE 2---connect to mongod (mongoDB server)
// mongoose.connect(dbUrl, { useNewUrlParser: true });
console.log(dbUrl);
//====for heroku and local,according to the reqmt=====
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{
    console.log("Connected to DATABase!");
}).catch((err)=>{
    console.log("ERROR",err.message);
});

//tell express to use body-parser
app16.use(bodyParser.urlencoded({extended: true}));

app16.use(methodOverride("_method"));

app16.use(flash());

//===========IMPORTANT LINE AHEAD============--->	
// seedDB(); //comment it so that it does not show-"Cannot read property 'name' of null "
//===========================================

//moment js config
app16.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app16.use(require("express-session")({
   secret:"App 6 is working",
   resave:false,
   saveUninitialized:false
}));
app16.use(passport.initialize());
app16.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//self created middleWare
//to pass req.user to every route for checking which to show on the nav-bar->login or signup or logout
app16.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.info=req.flash("info");
    res.locals.success=req.flash("success"); //// why isn't it working like the other two above?
    next();
});

app16.use(indexRoutes);
app16.use("/campgrounds",campgroundRoutes);
app16.use("/campgrounds/:id/comments",commentRoutes);

//Campground schema and model were here

//tell express to serve public and other non-default directories by default
app16.use(express.static(__dirname+"/public"));

//to omit writing .ejs in front of every ejs file
//app16.set("view engine","ejs");



//tell express to start server
var port = process.env.PORT || 3000;
app16.listen(port, function () {
  console.log("Server app16 Has Started!");
});