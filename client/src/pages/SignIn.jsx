import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const {error, loading} = useSelector((state)=> state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevState)=>{
      return {
        ...prevState,
        [e.target.id] : e.target.value
      }
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch(signInStart());
    try{
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    }
    catch(err){
      dispatch(signInFailure(err.message));
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input className='border p-3 rounded-r-lg' type='email' placeholder='Email' id='email' onChange={handleChange} />
        <input className='border p-3 rounded-r-lg' type='password' placeholder='Password' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading' : 'Sign In'}</button>
        <OAuth />
      </form>
      <div className='mt-5 flex gap-2'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}> 
          <span className='text-blue-700'>Sign up </span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}
