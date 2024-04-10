import React, { useState, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

function CreateListing() {
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputFileType = useRef();
  const [formError, setFormError] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const handleFileSubmit = (e) => {
    if (files.length == 0) {
      return setImageUploadError("No image selected");
    }
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError(false);
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          if (inputFileType.current) {
            inputFileType.current.value = "";
          }
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          if (inputFileType.current) {
            inputFileType.current.value = "";
          }
          setImageUploadError(
            "File size must be < 2MB and file must be an image."
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload upto 6 images per listing");
      if (inputFileType.current) {
        inputFileType.current.value = "";
      }

      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    });
    setFormData({
      ...formData,
      imageUrls: newImgUrls,
    });
  };

  const handleFormChange = (e) => {
    setFormError(false);
    if(e.target.id == 'sale' || e.target.id === 'rent'){
      setFormData(
        {
          ...formData,
          type : e.target.id
        }
      )
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' ||  e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.value,
      })
    }
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    if(formData.imageUrls.length < 1){
      return setImageUploadError('You must upload atleast 1 image');
    }
    if(+formData.discountPrice > +formData.regularPrice){
      return setFormError('Discount price must be lower than the regular price');
    }
    setLoadingForm(true);
    try{
      const res = await fetch('/api/listing/create', {
        method : 'POST', 
        headers : {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef : currentUser._id,
        }),
      })
      const data = await res.json();
      setLoadingForm(false);
      if(data.success === false){
        return setFormError(data.message);
      }
      navigate(`/listing/${data._id}`);
    }
    catch(err){
      setFormError(err.message);
      setLoadingForm(false);
    }
  }
  
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 sm:flex-row mb-7">
        <div className="flex flex-col flex-1 gap-4">
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Property Title"
            id="title"
            maxLength="62"
            value={formData.title}
            onChange={handleFormChange}
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="p-3 border rounded-lg"
            id="description"
            value={formData.description}
            onChange={handleFormChange}
            required
          />
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            value={formData.address}
            onChange={handleFormChange}
            maxLength="70"
            minLength="10"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                className="w-5"
                id="sale"
                type="checkbox"
                onChange={handleFormChange}
                checked={formData.type === "sale"}
              ></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                id="rent"
                type="checkbox"
                onChange={handleFormChange}
                checked={formData.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                id="parking"
                onChange={handleFormChange}
                checked={formData.parking}
                type="checkbox"
              ></input>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                id="furnished"
                type="checkbox"
                onChange={handleFormChange}
                checked={formData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                id="offer"
                type="checkbox"
                onChange={handleFormChange}
                checked={formData.offer}
              ></input>
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
                value={formData.bedrooms}
                onChange={handleFormChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleFormChange}
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
                value={formData.regularPrice}
                onChange={handleFormChange}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
           {formData.offer && ( <div className="flex gap-2 items-center">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                required
                min={0}
                max={10000000}
                value={formData.discountPrice}
                onChange={handleFormChange}
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>)}
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
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-xs text-red-500">{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-4 ">
              {formData.imageUrls.map((url, index) => {
                return (
                  <div
                    className="flex justify-between items-center p-3 border rounded-lg border-gray-300"
                    key={index}
                  >
                    <img
                      className="h-20  w-20 object-cover rounded-lg"
                      src={url}
                      alt="listing-img"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      type="button"
                      className="text-red-500 text-lg p-5 uppercase hover:opacity-75"
                    >
                      DELETE
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            disabled={uploading || loadingForm}
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-80"
          >
            {loadingForm ? 'Creating...' : 'Create'}
          </button>
          {formError && <p className="text-red-700 text-sm">{formError}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
