
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}    


const express=require("express");
const app=express();
const port=process.env.PORT || 8081;
const path=require("path");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const userRouter=require("./routes/user.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");
const passport=require("passport");
app.use('/uploads', express.static('uploads'));

let dbUrl=process.env.ATLASDB_URL;


const mongoose=require("mongoose");
main()
    .then(res=>console.log("connection successful"))
    .catch(err=>console.log(err));
async function main(){
    await mongoose.connect(dbUrl);
}
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

});
store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user || null;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=newUser({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', ejsMate);


const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));




// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });







app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong!"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});




