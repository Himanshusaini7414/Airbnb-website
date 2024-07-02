const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const  multer =require("multer")
const{storage}=require("../cloudConfig.js")
const upload =multer({storage})
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.route("/:id")
.get( wrapAsync(listingController.showlisting))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEdit));
module.exports=router;