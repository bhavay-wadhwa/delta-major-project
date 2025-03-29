const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')

const {storage}=require("../cloudConfig.js")
const upload = multer({storage})

router.route("/")
.get(
  wrapAsync(listingController.index)
  
)
.post(
  
  isLoggedIn,
  
  upload.single('listing[image]'),
  
  
  wrapAsync(listingController.createListing),
  validateListing
  
);


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm );

router.route("/:id")
.get(
  
  wrapAsync(listingController.showListing)
)
.put(
  
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  // validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// Index route




//Create Route


//Show route


//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Update route


//Delete route


module.exports = router;

