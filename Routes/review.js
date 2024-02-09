const express =require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const Review=require("../models/review.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");


//post method
router.post("/",isLoggedIn, validateReview ,wrapasync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Posted!!");
    
    res.redirect(`/listings/${listing._id}`)

}));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapasync(async(req, res) => {
    let { id, reviewId } = req.params;
    // console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,  {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}`);
}));
module.exports=router;