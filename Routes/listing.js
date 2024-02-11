const express =require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });


router
    .route("/")
    //index route
        .get(wrapasync(listingcontroller.index))
    //create route
        .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapasync(listingcontroller.createListing));




//new route
router.get("/new",isLoggedIn,listingcontroller.renderNewForm);



router.route("/:id")
    //Update Route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapasync(listingcontroller.updateListing))

    //delete route
    .delete(isLoggedIn,isOwner,wrapasync(listingcontroller.destroyListing))

    //show route
    .get(wrapasync(listingcontroller.showListing));


//edit route
router.get("/:id/edit",isOwner,wrapasync(listingcontroller.renderEditForm));




module.exports=router;