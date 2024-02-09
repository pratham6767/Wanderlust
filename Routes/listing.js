const express =require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");





//index route
router.get("/",wrapasync( async (req, res) => {
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs", {allListings});
  }));
//new route
router.get("/new",isLoggedIn,async(req,res)=>{
    res.render("listings/new.ejs");
});
//show route
router.get("/:id",wrapasync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not Exist!!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", {listing});

}))
//create route
router.post("/",isLoggedIn,validateListing,wrapasync(async(req,res,next)=>{
    
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing created!!");
    res.redirect("/listings"); 
    next(err);
}))
//edit route
router.get("/:id/edit",isOwner,wrapasync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not Exist!!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))
//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapasync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapasync( async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
}))

module.exports=router;