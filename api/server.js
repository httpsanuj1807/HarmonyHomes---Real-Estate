import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


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


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes middlewares
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})