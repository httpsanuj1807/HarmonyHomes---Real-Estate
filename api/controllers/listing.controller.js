import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "No listing found."));
    }
    if (listing.userRef != req.user.id) {
      return next(
        errorHandler(401, "You are only allowed to delete your own listings.")
      );
    }
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json("Listing deleted successfully");
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "No listing found."));
    }
    if (listing.userRef != req.user.id) {
      return next(
        errorHandler(401, "You are only allowed to update your own listings.")
      ); 
    }
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err.message);
  }
};


export const getListing = async(req, res, next) => {
  try{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return next(errorHandler(404, 'Listing not found'));
    }

    res.status(200).json(listing);
  }
  catch(err){
    next(err);
  }
}

export const getAllListings = async(req, res, next) => {
  try{
    const limit = req.query.limit || 8;
    const startIndex = req.query.startIndex || 0;
    let offer = req.query.offer;

    if(offer == 'false' || offer == undefined){
      offer = {$in : [true, false]};
    }

    let furnished = req.query.furnished;

    if(furnished == 'false' || furnished == undefined){
      furnished = {$in : [true, false]};
    }

    let parking = req.query.parking;

    if(parking == 'false' || parking == undefined){
      parking = {$in : [true, false]};
    }

    let type = req.query.type;

    if(type == 'all' || type == undefined){
      type ={$in : ['sale', 'rent']};
    }
    let searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      title: {$regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking, 
      type,
    }).sort({[sort]: order}).limit(limit).skip(startIndex);
    console.log(listings);

    return res.status(200).json(listings); 
  } 
  catch(err){
    next(err);
  }
}