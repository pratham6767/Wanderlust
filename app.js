const express =require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash")




const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js")

const url="mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected to db");

}).catch(err=>{
    console.log(err);
})


async function main() {
    await mongoose.connect(url);
}

  


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const Sessionoptions={
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires:Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


app.use(session(Sessionoptions))
app.use(flash())


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");

    // console.log(success)
    next();
})


app.get("/",(req,res)=>{
    res.send("hii");
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



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
