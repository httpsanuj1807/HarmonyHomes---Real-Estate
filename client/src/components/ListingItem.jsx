import React from 'react'
import {Link} from 'react-router-dom';
import {FaLocationDot} from 'react-icons/fa6';
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
function ListingItem({listing}) {
  return (
    <div className='bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition:shadow w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' src={listing.imageUrls[0]} alt='listing-photo' />
        <div className='flex flex-col pt-3 gap-1 w-full'>
            <p className=' font-semibold text-slate-700 pl-3 text-lg truncate'>{listing.title}</p>
            <div className='flex pl-3 gap-2 items-center'>
                <FaLocationDot className='text-green-900 h-4 w-4'/>
                <p className='font-semibold text-sm text-gray-600'>{listing.address}</p>
            </div>
            <p className='pl-3 text-sm text-gray-600 text-justify pr-3 line-clamp-2'>{listing.description}</p>
             <p className='pl-3 text-slate-500 text-lg mt-3 font-semibold'>{listing.offer ? listing.discountPrice.toLocaleString(
                "en-US",
                { style: "currency", currency: "USD", minimumFractionDigits: 0 }
              ) : listing.regularPrice.toLocaleString(
                "en-US",
                { style: "currency", currency: "USD", minimumFractionDigits: 0 }
              )} {listing.type === 'rent' && ' / month' }</p>

              <div className='flex gap-4 pl-3 pr-3 mb-3'>
              <div className="flex items-center gap-2 text-green-900 font-semibold">
                <FaBed/>
                <p>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</p>
              </div>
              <div className="flex items-center gap-2 text-green-900 font-semibold ">
                <FaBath/>
                <p>{listing.bathrooms} {listing.bedrooms > 1 ? 'Baths' : 'Bath'}</p>
              </div>
            </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingItem
