import React from "react";

function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b-2 p-7 flex md:border-r-2 md:min-h-screen">
        <form className="flex flex-col w-full gap-6">
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
              className="p-3 border rounded-lg w-full"
            />
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <label className="font-semibold  whitespace-nowrap">Type:</label>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="all" />
              <span>Rent & sale</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="sale" />
              <span>Sale</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-semibold  whitespace-nowrap">
              Amenities:
            </label>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="parking" />
              <span>Parking</span>
            </div>
            <div className="flex gap-1">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-semibold whitespace-nowrap">Sort:</label>
            <select className="rounded-lg p-3" id="sort_order">
              <option>Price high to low</option>
              <option>Price low to hight</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 font-semibold hover:opacity-90 uppercase text-white p-3 rounded-lg">
            Search
          </button>
        </form>
      </div>
      <div className="p-7 flex-1">
        <p className="text-3xl font-semibold text-slate-700">
          Listing results:
        </p>
      </div>
    </div>
  );
}

export default Search;
