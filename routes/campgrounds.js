var express=require("express");
var router =express.Router();
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
            res.render("campgrounds/index.ejs",{campgrounds:allCampgrounds,page:'campgrounds'});
        }
    });
    
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
});

module.exports=router;
