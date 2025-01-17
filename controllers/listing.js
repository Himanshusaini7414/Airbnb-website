const Listing=require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async(req,res)=>{
  const alllisting=await Listing.find({});
  res.render("listing/index.ejs",{alllisting});
  //res.send("Working");
};
module.exports.renderNewForm=(req,res)=>{
  res.render("listing/new.ejs",)
}
module.exports.showlisting =async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
  if(!listing){
    req.flash("error","listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs",{listing});
}
module.exports.createListing =async(req,res,next)=>{
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()
  let url =req.file.path;
  let filename=req.file.filename;
  const newListing =new Listing (req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename}
  newListing.geometry = response.body.features[0].geometry;
  let geoData = await newListing.save();
  console.log(geoData);
  await newListing.save();
  req.flash("success","New Listing Created");
  res.redirect("/listings");
}
module.exports.renderEdit=async(req,res)=>{
  let{id}=req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listing/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
  if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
  }
  res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async(req,res)=>{
  let{id}=req.params;
  let deleteListing=await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Delete");
  res.redirect("/listings");
}