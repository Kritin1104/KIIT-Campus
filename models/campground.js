var mongoose=require("mongoose");

//Schema Setup
var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    createdAt:{type:Date,default:Date.now},
    author:{
      id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User" 
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

//Compile Schema into a Model used thorugh variable
var Campground=mongoose.model("Campground",campgroundSchema);
//export it for outside use
module.exports=Campground;