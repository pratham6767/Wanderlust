const express =require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js")


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};



//index route
router.get("/",wrapasync( async (req, res) => {
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs", {allListings});
  }));
//new route
router.get("/new",wrapasync(async(req,res)=>{
    res.render("listings/new.ejs");
}));
//show route
router.get("/:id",wrapasync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not Exist!!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});

}))
//create route
router.post("/",validateListing,wrapasync(async(req,res,next)=>{
    
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing created!!");
    res.redirect("/listings"); 
    next(err);
}))
//edit route
router.get("/:id/edit",wrapasync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not Exist!!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))
//Update Route
router.put("/:id",validateListing,wrapasync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapasync( async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
}))

module.exports=router;