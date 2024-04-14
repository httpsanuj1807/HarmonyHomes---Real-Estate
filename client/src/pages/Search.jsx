import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import ListingItem from "../components/ListingItem";
function Search() {
  const [errorFetchingListings, setErrorFetchingListings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm : '',
    type: 'all',
    offer : false,
    parking : false,
    furnished: false,
    sort : 'createdAt',
    order: 'desc'
  });
  console.log(listings);
  useEffect(()=>{
    
    const fetchUrlParams = async() => {
      const urlParams = new URLSearchParams(location.search);
      const urlSearchTerm = urlParams.get('searchTerm') || '';
      const urlType = urlParams.get('type') || 'all';
      const urlOffer = urlParams.get('offer') || false;
      const urlParking = urlParams.get('parking') || false; 
      const urlFurnished = urlParams.get('furnished') || false;
      const urlSort = urlParams.get('sort') || 'createdAt';
      const urlOrder = urlParams.get('order') || 'desc';
      setSideBarData({
        searchTerm : urlSearchTerm,
        type: urlType,
        offer : urlOffer === 'true' ? true : false,
        parking : urlParking === 'true' ? true : false,
        furnished: urlFurnished === 'true' ? true : false,
        sort : urlSort,
        order: urlOrder
      })
    }
    const fetchListing = async() => {
      setLoading(true);
      setErrorFetchingListings(false);
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.toString();
      try{
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        if(data.success === false){
          setLoading(false);
          setErrorFetchingListings(err.message)
        }

        setListings(data);
        setLoading(false);
        setErrorFetchingListings(false);
      }
      catch(err){
        setLoading(false);
        setErrorFetchingListings(err.message)
      }
    }
    fetchUrlParams();
    fetchListing();

  }, [location.search]);


  const handleChange = (e) => {
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
      setSideBarData({...sideBarData, type : e.target.id})
    } 
    if(e.target.id === 'searchTerm'){
      setSideBarData({...sideBarData, searchTerm :e.target.value})
    } 
    if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished'){
      setSideBarData({...sideBarData, [e.target.id] : e.target.checked || e.target.checked === 'true' ? true : false})
    }

    if(e.target.id == 'sort_order'){
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSideBarData({...sideBarData, sort, order});
    }
    
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sideBarData.searchTerm);
    urlParams.set('type', sideBarData.type);
    urlParams.set('offer', sideBarData.offer);
    urlParams.set('parking', sideBarData.parking);
    urlParams.set('furnished', sideBarData.furnished);
    urlParams.set('sort', sideBarData.sort);
    urlParams.set('order', sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b-2 p-7 flex md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
          <div className="flex gap-4 items-center">
            <label
              htmlFor="searchTerm"
              className="font-semibold  whitespace-nowrap"
            >
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sideBarData.searchTerm}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <label className="font-semibold  whitespace-nowrap">Type:</label>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="all" onChange={handleChange} checked={sideBarData.type === 'all'}/>
              <span>Rent & sale</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={sideBarData.type === 'rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={sideBarData.type === 'sale'}/>
              <span>Sale</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={sideBarData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-semibold  whitespace-nowrap">
              Amenities:
            </label>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="parking"  onChange={handleChange} checked={sideBarData.parking}/>
              <span>Parking</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="furnished"  onChange={handleChange} checked={sideBarData.furnished}/>
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-semibold whitespace-nowrap">Sort:</label>
            <select className="rounded-lg p-3" id="sort_order" onChange={handleChange} defaultValue={'createdAt_desc'}>
              <option value={'regularPrice_desc'}>Price high to low</option>
              <option value={'regularPrice_asc'}>Price low to high</option>
              <option value={'createdAt_desc'}>Latest</option>
              <option value={'createdAt_asc'}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 font-semibold hover:opacity-90 uppercase text-white p-3 rounded-lg">
            Search
          </button>
        </form>
      </div>
      <div className="p-7 flex-1">
        <p className="text-3xl mb-4 font-semibold text-slate-700">
          Listing results:
        </p>
        {loading && <p className="text-center p-4">Hold tight, fetching listings for you...</p>}
        {!errorFetchingListings && !loading  && listings.length == 0 && <p  className="text-center p-4">No listing found.</p>}
        {errorFetchingListings && <p className="text-red-500 text-center p-4">Error fetching listings currently. Try again</p>}
        {!errorFetchingListings && !loading && listings.length > 0 && (
          <div className="flex flex-wrap ">
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))} 
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
