import express from 'express';
import  { updateProfile }  from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.post('/update/:id',verifyToken,  updateProfile);

export default router; 