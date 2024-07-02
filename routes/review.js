const express =require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/ExpressError");
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js")
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.reviewDelete));
module.exports=router;