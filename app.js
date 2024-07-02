if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
console.log(process.env.SECRET)
const express=require("express");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const path=require("path");
const ExpressError = require("./utils/ExpressError");
const app=express();
const port =8080;
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const User=require("./models/user.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const passport=require("passport");
const LocalStrategy=require("passport-local");
//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL;
main()
.then(()=>{
  console.log("connected to db");
})
.catch((err)=>{
  console.log(err);
});
async function main(){
  await mongoose.connect(dburl);
}
const store =  MongoStore.create({
  mongoUrl:dburl,
  crypto: {
      secret:"mysupersecrect",
    },
    touchAfter: 24 * 3600,
});
store.on("error",()=>{
  console.log(err);
})
const sessionOption={
  store,
  secret:"mysupersecrect",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*4*60*60*1000,
    httpOnly:true,
  }
};
app.use(session(sessionOption));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.errorMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  res.locals.currentUser = req.user;
  next();
});
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found !"));
})
app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went Wrong"}=err;
  res.status(statusCode).render("listing/error.ejs",{message})
})
app.listen(port,()=>{
  console.log("server is listening");
});