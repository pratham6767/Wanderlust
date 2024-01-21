const express =require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const url="mongodb://127.0.0.1:27017/wanderlust"
const path = require("path")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const wrapasync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/review.js")





main().then(()=>{
    console.log("connected to db");

}).catch(err=>{
    console.log(err);
})


async function main() {
    await mongoose.connect(url);
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

  


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));




app.get("/",(req,res)=>{
    res.send("hii");
})

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};




//index route
app.get("/listings",wrapasync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  }));
//new route
app.get("/listings/new",wrapasync(async(req,res)=>{
    res.render("listings/new.ejs");
}));
//show route
app.get("/listings/:id",wrapasync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});

}))
//create route
app.post("/listings",validateListing,wrapasync(async(req,res,next)=>{
    
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
    next(err);
}))
//edit route
app.get("/listings/:id/edit",wrapasync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))
//Update Route
app.put("/listings/:id",validateListing,wrapasync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapasync( async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

//review route
//post method
app.post("/listings/:id/reviews", validateReview ,wrapasync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`)

}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapasync(async(req, res) => {
    let { id, reviewId } = req.params;
    // console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,  {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));



// app.get("/testdata", async(req,res)=>{
//     let sample=new Listing({
//         title:"my villa",
//         descreption:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india",
//     });
//     await sample.save();
//     console.log("saved");
//     res.send("sucess")

// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let{statusCode="505",message="Something went wrong!!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
    // res.status(statusCode).send(message)
})
app.listen(3000,()=>{
    console.log("server is live");
})
