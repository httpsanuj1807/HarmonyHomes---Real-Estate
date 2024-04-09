import React, { useState, useRef } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase.js';



function CreateListing() {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls : []
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputFileType = useRef();
  const handleFileSubmit = (e) => {
    if(files.length == 0){
      return setImageUploadError('No image selected');
    }
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
      setImageUploadError(false);
      setUploading(true);
      const promises = [];
      for(let i=0 ; i<files.length ; i++){
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
      .then((urls) => {
        if (inputFileType.current) {
          inputFileType.current.value = ''; 
        }
        setFormData(
          {
            ...formData,
            imageUrls : formData.imageUrls.concat(urls),
          }
        )
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        if (inputFileType.current) {
          inputFileType.current.value = ''; 
        }
        setImageUploadError('File size must be < 2MB and file must be an image.');
        setUploading(false);
      })
      
    }
    else{
      setImageUploadError('You can only upload upto 6 images per listing');
      if (inputFileType.current) {
        inputFileType.current.value = ''; 
      }
      
      setUploading(false);
    }
  }
  const storeImage = async(file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
      (snapshot) => {
         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          resolve(downloadUrl);
        });
      }
    );
    });
  };

  const handleDeleteImage = (index) => {
    setImageUploadError(false);
    let newImgUrls = [];
    newImgUrls = formData.imageUrls.filter((url, ind) => {
      return index != ind;
    })
    setFormData(
      {
        ...formData,
        imageUrls : newImgUrls
      }
    )
  }
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
              ref={inputFileType}
              accept="images/*"
              multiple
              onChange={(e) => {
                setImageUploadError(false);
                setFiles(e.target.files);
                setUploading(false);
              }}
            />
            <button
            disabled={uploading}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleFileSubmit}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className="text-xs text-red-500">{imageUploadError}</p>}

          {formData.imageUrls.length > 0 && 
            <div className="flex flex-col gap-4 ">
              {formData.imageUrls.map((url, index) => {
                return ( 
                  <div className="flex justify-between items-center p-3 border rounded-lg border-gray-300" key={index}>
                  <img className="h-20  w-20 object-cover rounded-lg" src={url} alt='listing-img' />
                  <button onClick={() => handleDeleteImage(index)} type="button"  className="text-red-500 text-lg p-5 uppercase hover:opacity-75">DELETE</button>
                  </div>
                )
              })}
            </div>
          }

          <button
          disabled={uploading}
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
