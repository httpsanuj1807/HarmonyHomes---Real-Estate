import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})