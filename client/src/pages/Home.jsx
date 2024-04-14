import { useState, useEffect} from "react"
import {Link} from "react-router-dom"
import SwiperCore from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css/bundle';
import {Navigation} from 'swiper/modules'
import ListingItem from "../components/ListingItem";
export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async() => {
      try{
        const res = await fetch(`/api/listing/get?offer=true&limit=3`)
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      }
      catch(err){
         console.log(err);
      }
    }
    const fetchRentListings = async() => {
      try{
        const res = await fetch(`/api/listing/get?type=rent&limit=3`)
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      }
      catch(err){
         console.log(err);
      }
    }
    const fetchSaleListings = async() => {
      try{
        const res = await fetch(`/api/listing/get?type=sale&limit=3`)
        const data = await res.json();
        setSaleListings(data);
      }
      catch(err){
        console.log(err);
      }
    }
    fetchOfferListings();
  }, []);
  return (
    <>
    {/* top landing page */}
      <div className="flex flex-col gap-6 p-28 px-2 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find you next <span className="text-slate-500">perfect</span> <br /> place with ease</h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahand Estate will help you find your home fast, easy and comfortable.
          <br />
          Our expert support are always available.
        </div>
        <Link className="text-xs sm:text-sm font-bold text-blue-800 hover:underline" to={'/search'}>Lets get started</Link>
      </div>

      {/* slider */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          (
            offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                
              ></div>
            </SwiperSlide>
          ))
          )}
      </Swiper>
      
      {/* offers */}

      <div className="max-w-6xl flex flex-col gap-8 mx-auto p-2 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
              <Link className="text-blue-800 hover:underline text-sm" to={`/search?offer=true`}>Show more offers</Link>
            </div>
           
           <div className="flex flex-wrap gap-y-8 justify-between gap-4">
              {offerListings.map((listing) => {
                return (<ListingItem listing={listing} key={listing._id}/>)
              })}
            </div>
           
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-y-8 justify-between gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )} 
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-y-8 justify-between gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
