import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import Listing from "../models/listing.model.js";

export const updateProfile = async(req, res, next) => {
    if(req.params.id != req.user.id){
        return next(errorHandler(401, 'You are only allowed to make change to your own profile only.'))
    }

    try{
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                password:req.body.password,
                email: req.body.email,
                avatar:
                req.body.avatar
            }
        }, {new: true})
        const {password: pass, ...rest} = updatedUser._doc;
        res.status(200).json((rest));
    }
    catch(err){
        next(err);
    }

}

export const deleteProfile = async(req, res, next) => {
    if(req.params.id != req.user.id){
        return next(errorHandler(401, 'You are only allowed to delete your own account.'))
    }
    try{
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('jwt').status(200).json('User Deleted Successfully');
    }
    catch(err){
        next(err);
    }
}

export const showUserListings = async(req, res, next) => {
    if(req.params.id === req.user.id){
        try{
            const listings = await Listing.find({userRef : req.params.id});
            res.status(200).json(listings);
        }
        catch(err){
            next(err);
        }
    }
    else{
        next(errorHandler(401, 'Unauthorised Access'));
    }
}

export const getUser = async(req, res, next) => {
    try{
        
        const user = await User.findById(req.params.id);

        if(!user){
            next(errorHandler(404, 'User not found'));
        }
        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
    }
    catch(err){
        next(err);
    }
}