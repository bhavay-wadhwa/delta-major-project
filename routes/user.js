const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm )
.post(
  
  wrapAsync(userController.signupUser)
);


router.route("/login")
.get(userController.renderLoginForm )
.post(
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userController.login
  
);





router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
})

module.exports = router;
