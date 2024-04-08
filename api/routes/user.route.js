import express from 'express';
import  { updateProfile, deleteProfile }  from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.post('/update/:id',verifyToken,  updateProfile);
router.delete('/delete/:id',verifyToken,  deleteProfile);

export default router; 