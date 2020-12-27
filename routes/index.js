var express=require("express");
var router =express.Router(); //so as we get out of defining app(Version).js in every file 
var passport=require("passport");
var User=require("../models/user.js");

//ROOT ROUTE
router.get("/",function(req,res){
    // res.send("<h1>Welcome to Home Pageee</h1>");->possible
    res.render("landing.ejs");
});

//==============================
//Auth Routes start from here
//===============================

//show register form
router.get("/register",function(req,res){
    res.render("register.ejs",{page:'register'});
});

//handle sign up logic // success
router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        //===old also works===
        if(err)
        {
            // console.log(err);
            req.flash("error",err.message);
            return res.redirect("/register");
        }

        // //===new does not works====
        // if(err){
        //     console.log(err);
        //     return res.render("register", {error: err.message});
        // }

        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to KIIT Campus "+user.username);
            res.redirect("/campgrounds");
        })
    })
});

//login form handling
//show login form
router.get("/login",function(req,res){
    res.render("login.ejs",{page:'login'});
});

//handle login logic->using middleware-> whole of passport.authenticate part
//pattern->app7.post("/login",middleware,callback function)
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"

    }),function(req,res){
        //leave
});

//logout handling // success
router.get("/logout",function(req,res){
    req.logout(); //comes with all the pkgs we have installed like passport and all
    req.flash("info","Logged Out Successfully!")
    res.redirect("/campgrounds");
});

//Now after splitting files into routes,don't use erroneous requests
// //erroneous request->always keep at last
// router.get("*",function(req,res){
//     res.send("You made an erroneus request");
// });

module.exports=router;