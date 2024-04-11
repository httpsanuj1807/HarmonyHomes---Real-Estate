import express from 'express';
import  { updateProfile, deleteProfile, showUserListings,getUser }  from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

router.post('/update/:id',verifyToken,  updateProfile);
router.delete('/delete/:id',verifyToken,  deleteProfile);
router.get('/listings/:id', verifyToken, showUserListings);
router.get('/:id', verifyToken, getUser);

export default router; 