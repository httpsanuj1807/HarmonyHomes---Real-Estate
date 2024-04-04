import User from "../models/user.model.js";
import bcrypt from 'bcrypt';


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
}