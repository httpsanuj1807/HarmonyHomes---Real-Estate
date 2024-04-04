import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

const saltRounds = 10; 

export const signup = async(req, res, next) => {
    const { username, email, password } = req.body; 
    const hashed = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({username, email, password : hashed});
    try{
        await newUser.save();
        res.status(201).json("User created successfully.");
    }
    catch(err){
        next(err);
    }
};


export const signin = async(req, res, next) =>{
    const {email, password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404, 'User not found'));
        }
        const isValidPassword = bcrypt.compareSync(password, validUser.password);
        if(!isValidPassword){
            return next(errorHandler(401,'Invalid email or password.'));
        }
        const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET);
        const {password : pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {
            httpOnly : true,
            maxAge : 1000 * 60 * 60 * 24,
        }).status(200).json(rest);
    }
    catch(err){
        next(err);
    }
};