const express =require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const url="mongodb://127.0.0.1:27017/wanderlust"
const path = require("path")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")


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
//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  });
//new route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
})
//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs", {listing});

});
app.post("/listings",async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})




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
app.listen(3000,()=>{
    console.log("server is live");
})
