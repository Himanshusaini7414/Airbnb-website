const express = require('express');
const router = express.Router();
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync");
const passport = require('passport');
const{savRedirectUrl}=require("../middleware");
const userController=require("../controllers/user")
router.route("/signup")
.get(userController.rendersignupForm)
.post(wrapAsync(userController.signup))
router.route("/login")
.get(userController.renderLogin)
.post(savRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);
router.get("/logout",userController.logout)
module.exports = router;