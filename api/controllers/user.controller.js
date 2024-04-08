import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

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