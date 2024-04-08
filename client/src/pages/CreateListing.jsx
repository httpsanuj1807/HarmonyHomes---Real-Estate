import React from "react";

function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row mb-7">
        <div className="flex flex-col flex-1 gap-4">
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="p-3 border rounded-lg"
            id="description"
            required
          />
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            maxLength="70"
            minLength="10"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input className="w-5" id="sale" type="checkbox"></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" id="rent" type="checkbox"></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" id="parking" type="checkbox"></input>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" id="furnished" type="checkbox"></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" id="offer" type="checkbox"></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                max={10}
                min={1}
                required
                defaultValue={2}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                defaultValue={2}
                max={10}
                min={1}
                required
              />
              <span>Baths</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min={50}
                required
                max={10000000}
                defaultValue={50}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountedPrice"
                required
                min={50}
                max={10000000}
                defaultValue={0}
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <div>
            <span className="font-semibold">Images: </span>
            <span className="text-sm">
              The first image will be the cover (max 6)
            </span>
          </div>
          <div className="flex gap-4">
            <input
              className="border p-3 border-gray-300 rounded-lg"
              type="file"
              accept="images/*"
              multiple
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
