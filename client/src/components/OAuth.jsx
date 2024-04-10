import React from 'react';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase.js'
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const info = {
                name : result.user.displayName,
                email : result.user.email,
                photo : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg&ga=GA1.1.2136921463.1712735858&semt=ais',
            }
            const res = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body :JSON.stringify(info)
            })
            const data = await res.json();
            dispatch(signInSuccess(data)); 
            navigate('/'); 
        }
        catch(err){
            console.log("could not sign with google", err);
        }
    }
  return (
    
      <button onClick={handleGoogleClick} type='button' className='bg-red-700 rounded-lg text-white uppercase p-3 hover:opacity-95'>Continue with google</button>

  )
}

export default OAuth;
 