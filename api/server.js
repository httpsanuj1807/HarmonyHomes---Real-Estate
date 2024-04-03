import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';


const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log('Connected to MongoDB');
}
)
.catch((error) => {
    console.log('Error connecting database.');
}
);

// middlewares

app.use('/api/user', userRouter);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})