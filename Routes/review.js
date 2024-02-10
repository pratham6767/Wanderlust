const express =require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js");
 
//post method
router.post("/",isLoggedIn, validateReview ,wrapasync(reviewcontroller.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapasync(reviewcontroller.destroyReview));


module.exports=router;