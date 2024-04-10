import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req, res, next) => {
    try{
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    }   
    catch(err){
        next(err);
    }
}


export const deleteListing = async(req, res, next) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, 'No listing found.'));
        }
        if(listing.userRef != req.user.id){
            return next(errorHandler(401, 'You are only allowed to delete your own listings.'))
        }
        try{
            await Listing.findByIdAndDelete(req.params.id);
            res.status(200).json('Listing deleted successfully');
        }
        catch(err){
            next(err);
        }
    }   
    catch(err){
        next(err);
    }
};

