var express=require("express");
var router =express.Router({mergeParams:true}); //so as we get out of defining app(Version).js in every file 
var Campground=require("../models/campground.js");
var Comment=require("../models/comment.js");
var middleware=require("../middleware");

//*******COMMENTS ROUTE*******//
//comments NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
    //find campground by Id
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new.ejs",{campground:campground});//this new.ejs is of comments directory,not of campground directory
        }
    })
    
});

//comments CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    req.flash("error","Something went wrong...");
                    console.log(err);
                }
                else
                {
                    //add username and id to comment 
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //and then save the comment 
                    comment.save(); 
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});
//********************//

//comment edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground)
        {
            req.flash("error","Campus Not Found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                res.render("comments/edit.ejs",{campground_id:req.params.id,comment:foundComment});
            }
        })
    })

});

//comment update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//comment DESTROY route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
            if(err)
            {
                res.redirect("back");
            }   
            else
            {
                req.flash("success","Comment deleted!");
                res.redirect("/campgrounds/" + req.params.id);
            }
    })
});

module.exports=router;