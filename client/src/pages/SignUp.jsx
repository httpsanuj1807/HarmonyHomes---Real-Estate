import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input className='border p-3 rounded-r-lg' type='text' placeholder='Username' id='username' />
        <input className='border p-3 rounded-r-lg' type='email' placeholder='Email' id='email' />
        <input className='border p-3 rounded-r-lg' type='password' placeholder='Password' id='password' />
        <button className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-95 disabled:opacity-80'>Sign up</button>
      </form>
      <div className='mt-5 flex gap-2'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}> 
          <span className='text-blue-700'>Sign in </span>
        </Link>
      </div>
    </div>
  )
}
