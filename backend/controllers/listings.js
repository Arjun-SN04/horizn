const { response } = require('express');
const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_BOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken});


module.exports.getShowPage=async (req,res,next)=>{
    
    let {id} =req.params;
    let listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    console.log(listing);
    if(!listing) {
         return res.status(404).json({message:'Listing not found'});
    }
    res.json({listing});
    
};

module.exports.getEditRender = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);

    if(!listing) {
        return res.status(404).json({message:'Listing not found'});
    }
    let originalUrl= listing.image;
    originalUrl=originalUrl.replace('/upload', '/upload/h_300/w_250'); // Adjust the URL to show a smaller image
    res.json({listing,originalUrl});
};

module.exports.getNewRender =async (req,res)=>{
    res.json({message:'Ready to create new listing'});
};


module.exports.createNewListing = async (req,res,next)=>{
let response = await geocodingClient.forwardGeocode({
  query: req.body.lististing.location, // Use the location from the form
  limit: 1
})
  .send();
  console.log(response.body);

     console.log(req.file);
    let url =req.file.path;
    // let filename =req.file.filename;
    // console.log(url);
    // console.log(filename);
    // if(!req.body.lististing) throw new ExpressError(400,'send valid listing');

   console.log(req.body);
    let allListings= new Listing(req.body.lististing);
    allListings.owner = req.user._id; // Set the owner to the current user
    allListings.image = url; // Set the image URL and filename
    allListings.geometry = response.body.features[0].geometry; // Set the geometry from the geocoding response
    await allListings.save();
    res.json({success:true, message:'Successfully created a new listing'});
};


module.exports.updateListing = async (req,res)=>{
    if(!req.body.lististing) throw new ExpressError(400,'send valid listing');
     // console.log(req.body);
     let {id}=req.params;

      // Update the image URL
    
     let allListings= await Listing.findByIdAndUpdate(id,{...req.body.lististing});
     if(typeof req.file!=='undefined'){
     allListings.image = req.file.path; // Update the image URL
        await allListings.save();
     }
     res.json({success:true, message:'Successfully updated the listing'});
};

module.exports.deleteListing = async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
res.json({success:true, message:'Successfully deleted the listing'});
};

module.exports.getAllListings = async(req,res)=>{
    const allListings = await Listing.find({});
    
    res.json({allListings});
   
};