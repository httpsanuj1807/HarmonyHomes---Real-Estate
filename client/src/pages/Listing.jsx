import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
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
                  className="h-[300px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}

export default Listing;
