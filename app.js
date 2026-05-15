const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressErrors.js");
const  Review= require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })


async function main() {
    await mongoose.connect(MONGO_URL);
}
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi ,i am root");
});
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });//this listings is views/listing


});

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing })
});

//post/create request
app.post("/listings", wrapAsync(async (req, res, next) => {
    //   const { listing } = req.body; // req.body.listing = { title, image: { url }, price, ... }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// app.post("/listings", wrapAsync(async(req, res,next) => {


//     let { title, description, image, price, location, country } = req.body;

//     const newListing = new Listing({
//         title,
//         description,
//         image: {
//             url: image,
//             filename: "listingimage"
//         },
//         price,
//         location,
//         country
//     });

//     await newListing.save();  // ✅ Save to DB
//     res.redirect("/listings"); // ✅ Redirect after successful save

// }));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });

}));
//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews
//posr route
app.post("/listings/:id/reviews" ,async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview._id);
    await newReview.save();
    await listing.save();
    console.log("review saved");
    // res.send("review added");
    res.redirect(`/listings/${listing._id}`);
});

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete (reviewId);
    res.redirect(`/listings/${id}`);
}))

// app.post("/listings",async(req,res)=>{
//     let {title,description,image,price,location,country}=console.log(res.body);
// } );
// app.get("/testListing",async (req,res)=>{
//     let sampleListings=new Listing({
//         title: "My New Villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("sucessessful testing");
// });

//ramdom route thhis syntax /.*/ is very important that old version of express used "*" 
// latest version use /.*/
app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "page not found!"));
});
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message);
    

});
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});