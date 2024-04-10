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