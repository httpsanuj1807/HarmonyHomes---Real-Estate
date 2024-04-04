import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(null);
    setFormData((prevState)=>{
      return {
        ...prevState,
        [e.target.id] : e.target.value
      }
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message);
        return;
      }
      console.log(data);
      setError(null);
      navigate('/sign-in');
    }
    catch(err){
      setLoading(false);
      setError(err.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input className='border p-3 rounded-r-lg' type='text' placeholder='Username' id='username' onChange={handleChange} />
        <input className='border p-3 rounded-r-lg' type='email' placeholder='Email' id='email' onChange={handleChange} />
        <input className='border p-3 rounded-r-lg' type='password' placeholder='Password' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading' : 'Sign up'}</button>
      </form>
      <div className='mt-5 flex gap-2'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}> 
          <span className='text-blue-700'>Sign in </span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}
