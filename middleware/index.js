//all the middleware goes here

var Campground=require("../models/campground.js");
var Comment=require("../models/comment.js");
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err || !foundCampground)
                {
                    req.flash("error","Campus Not Found!");
                    // console.log(err);
                    res.redirect("back");
                }   
                else 
                {
                    //if yes,does the user own that particular campground which is bring edited?
                    if(foundCampground.author.id.equals(req.user.id))
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error","You do not have permission to do that.")
                        res.redirect("back");
                    }
                }
            })
        }
        else
        {
            req.flash("error","You need to be logged in to do that!");
            res.redirect("back");
            //new feature->takes the user back from where they came from
        }
    }

middlewareObj.checkCommentOwnership=function(req,res,next){
        if(req.isAuthenticated())
        {
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err || !foundComment)
                {
                    // console.log(err);
                    req.flash("error","Comment Not Found!");
                    res.redirect("back");
                }   
                else 
                {
                    //if yes,does the user own that particular comment which is bring edited?
                    if(foundComment.author.id.equals(req.user.id))
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error","You don't have permission to do that.");
                        res.redirect("back");
                    }
                }
            })
        }
        else
        {
            req.flash("error","You need to be logged in to do that!");
            res.redirect("back");
            //new feature->takes the user back from where they came from
        }
    }  

middlewareObj.isLoggedIn=function(req,res,next){
            //self defined middleware to stop unauthenticated user fromentering comments
            if(req.isAuthenticated()){
                return next();
            }
            req.flash("error","You need to be logged in do that!");
            res.redirect("/login");
    }

module.exports = middlewareObj;