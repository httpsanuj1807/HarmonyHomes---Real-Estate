import express from 'express';
import  { updateProfile, deleteProfile, showUserListings }  from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.post('/update/:id',verifyToken,  updateProfile);
router.delete('/delete/:id',verifyToken,  deleteProfile);
router.get('/listings/:id', verifyToken, showUserListings);

export default router; 