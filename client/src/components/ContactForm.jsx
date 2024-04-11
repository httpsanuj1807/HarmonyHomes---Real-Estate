import React from 'react'
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
function ContactForm({listing}) {
  console.log( "From formPage",listing);
  const [landlord, setLandlord] = useState(undefined);
  const [message, setMessage] = useState('');
  const [errorFetching, setErrorFetching] = useState(false);
  useEffect(()=>{
    const getLandlord = async() => {
      try{
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log(data);
        if(data.success === false){
          setErrorFetching(data.message);
        }
        setLandlord(data);
      }
      catch(err){
        setErrorFetching(err.message);
      }
    }
    getLandlord();
  }, [listing]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }
  
  return (
    <>
      {errorFetching && <p className='text-red-700 text-sm'>Error fetching landload.</p>}
      {!errorFetching && landlord && (
        <div className='flex flex-col gap-3 mt-4'>
          <p>Contact <span className='font-semibold'>{landlord.username}</span> owner of<span className='font-semibold'>{' '}{listing.title}</span></p>
          <textarea onChange={handleMessageChange} value={message} placeholder='Enter your message here...' className='border border-x-gray-200 w-full rounded-lg p-3'  rows={3}  />
          
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}>
          <button onClick className='w-full bg-slate-700 rounded-lg text-white uppercase p-3 hover:opacity-95 font-semibold'>
            Send message
          </button>
          </Link>
        </div>
      )}
    </>
  )
}

export default ContactForm
