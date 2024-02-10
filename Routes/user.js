const express =require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const usercontroller=require("../controllers/user.js");
const { route } = require("./listing.js");



router.route("/signup")
    //signup user form
    .get(usercontroller.renderSignupForm)

    //add user to database
    .post(wrapasync(usercontroller.signup));



router.route("/login")
    //render user form
    .get(usercontroller.renderLoginForm)

    //authenticate user via passport.authenticate
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),usercontroller.login);




//log user out using logout passort method
router.get("/logout",usercontroller.logout);

module.exports=router;