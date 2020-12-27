var express=require("express");
var router =express.Router(); //so as we get out of defining app(Version).js in every file 
var Campground=require("../models/campground.js");
var middleware=require("../middleware");

//INDEX ROUTE(According to RESTful routing)
//shows all campgrounds
router.get("/",function(req,res){

    //Get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index.ejs",{campgrounds:allCampgrounds,page:'campgrounds'});//first one->data that is in campgrounds.ejs and 2nd->the name of the variable on app7.js
        }
    });
    
});

//CREATE ROUTE(According to RESTful routing)
//add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to campgrounds array
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description; //'description' keyword is coming from the new.ejs file where name="description"
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,image:image,description:desc,author:author};//the 2nd thing after : is the one we declared in this route
    //create a new campground & save to DB
    Campground.create(newCampground,function(err,newlyCreated){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(newlyCreated);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });

});

//NEW Route(According to RESTful routing)
//shows the form where we enter data
router.get("/new",middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new.ejs");
});
 
//SHOW - shows more info about one campground
router.get("/:id",function(req,res){
    //find the campground with required ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground)
        {
            req.flash("error","Campus not found");
            res.redirect("back");
        }
        else
        {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show.ejs",{campground:foundCampground});
        }
    })
    // req.params.id
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit.ejs",{campground:foundCampground});
    })
});

//UPDATE CAMPGROUND ROUTE for edit
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
             if(err)
             {
                 console.log(err);
                 res.redirect("/campgrounds");
             }
             else
             {
                 res.redirect("/campgrounds/" + req.params.id);
             }
    })
    //redirect somewhere(show page for the updated campground)
});

//DESTROY Campground route for edit
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/campgrounds");
        } 
        else
        {
            res.redirect("/campgrounds")
        }  
    })
});

module.exports=router;