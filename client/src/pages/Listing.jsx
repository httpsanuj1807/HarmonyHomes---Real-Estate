import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";

function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  console.log(typeof listing);
  console.log(listing);
  useEffect(() => {
    const getListingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);
        setError(null);
        setListing(data);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };
    getListingDetails();
  }, []);

  return (
    <main>
      {loading && (
        <p className="text-slate-700 text-center my-7">
          Hold on tight while we fetch...
        </p>
      )}
      {error && (
        <p className="text-red-700 text-center my-7">
          Unable to fetch listing currently
        </p>
      )}
      {listing && !error && !loading && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[450px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col my-7 p-5 gap-4 sm:max-w-5xl sm:mx-auto">
            <p className="text-2xl font-bold - $">
              {listing.title} -{" "}
              {(listing.regularPrice - listing.discountPrice).toLocaleString(
                "en-US",
                { style: "currency", currency: "USD", minimumFractionDigits: 0 }
              )}
            </p>

            <div className="flex gap-2 items-center">
              <p className="text-green-900"><FaLocationDot /></p>
              <p className="text-slate-600 font-semibold">{listing.address}</p>
            </div>
            <p className="w-1/3 sm:w-1/6 p-1 bg-red-900 rounded-lg text-center text-white font-semibold">
              {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
            </p>
            <div>
              <span className="font-semibold">Description: </span>
              <span className='text-slate-700'>{listing.description}</span>
            </div>
            <div className=" flex gap-4 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-green-900 font-semibold">
                <FaBed/>
                <p>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</p>
              </div>
              <div className="flex items-center gap-2 text-green-900 font-semibold ">
                <FaBath/>
                <p>{listing.bathrooms} {listing.bedrooms > 1 ? 'Baths' : 'Bath'}</p>
              </div>
              <div className={`flex items-center gap-2 font-semibold ${listing.parking ? 'text-green-900 ' : 'text-red-900'}`}>
                <FaParking/>
                <p>{listing.parking  ? 'Parking' : 'No Parking'}</p>
              </div>

              <div className={`flex items-center gap-2 font-semibold ${listing.furnished ? 'text-green-900 ' : 'text-red-900'}`}>
                <FaChair/>
                <p>{listing.furnished  ? 'Furnished' : 'Not Furnished'}</p>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Listing;
