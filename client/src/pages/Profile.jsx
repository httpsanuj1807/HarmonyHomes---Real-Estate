import {useDispatch, useSelector} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { app } from '../firebase.js';
import { Link } from 'react-router-dom';
import {updateProfileStart, updateProfileSuccess, updateProfileFailure,
        deleteUserStart, deleteUserSuccess, deleteUserFailure, 
        signOutStart, signOutSuccess, signOutFailure} from '../redux/user/userSlice.js';



export default function Profile() {
  const dispatch  = useDispatch();
  const{ currentUser, loading, error } = useSelector(state => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [wrongFileType, setWrongFileType] = useState(false);
  const [isUpdateSucces, setIsUpdateSuccess] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [myListingsError, setMyListingsError] = useState(false);
  useEffect(()=>{
    if(file){
      if(file.type.split('/')[0] !== 'image'){
        setWrongFileType(true);
        return;
      }
      setWrongFileType(false);
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // get access to firebase storage by providing our app
    const storage = getStorage(app);

    // now we have access to firebase storage, now the task is to create file reference , so for that we have to provide the path where we have to store our file, maybe in which /folder/name. But in our case we are not storing it in any folder, we simply want that to be saved by its name in root storage, so we are simply passing name
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    // now the task is to upload file, now we have two functions to upload, one is uploadBytes and other is uploadBytesResumables, we will use second one because we want to track out upload and also may modify in between like cancel , pause , resume

    const uploadTask = uploadBytesResumable(storageRef, file);

    // observing the status

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(Math.round(progress));
    },
    (error) => {
      setFileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
        setFormData({
          ...formData, 
          avatar : fileUrl
        })
      });
    }
  );
  }

  const handleChange = (e) => {
    setIsUpdateSuccess(false);
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      dispatch(updateProfileStart());
      setIsUpdateSuccess(false);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if(data.success == false){
        dispatch(updateProfileFailure(data.message));

        return;
      }
      dispatch(updateProfileSuccess(data));
      setFilePercentage(0);
      setIsUpdateSuccess(true);
    }
    catch(err){
      dispatch(updateProfileFailure(err.message));
    }
  }

  const handleUserDelete = async() => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method : 'DELETE',
      });

      const data = await res.json();

      if(data.success == false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess()); // empty bcoz to redirect to sign in page
    }
    catch(err){
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleUserSignOut = async() => {
    try{
      dispatch(signOutStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();

      if(data.success == false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(signOutSuccess()); // empty bcoz to redirect to sign in page
    }
    catch(err){
      dispatch(signOutFailure(err.message));
    }
  };

  const handleShowListings = async() => {
    setMyListingsError(false);
    try{
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setMyListingsError(data.message);
        return;
      }
      if(data.length === 0){
        return setMyListingsError('No listing to show. Create one above!');
      }
      setMyListings(data);
    }
    catch(err){
      setMyListingsError(err.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-semibold text-3xl my-7 text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])}  hidden ref={fileRef} type='file' accept='images/*' />
        <img onClick={() => {
          setFilePercentage(0);
          setIsUpdateSuccess(false);
          fileRef.current.click();
        }} className='rounded-full h-24 w-24 self-center object-cover cursor-pointer mt-2' src={formData.avatar || currentUser.avatar} alt='profile-img'></img>
        {(wrongFileType) ? (<p className='text-red-700 text-sm self-center'>Only images are allowed</p>) : (null)}
        {(fileUploadError) ? (<p className='text-red-700 text-sm self-center'>Error image upload. File size must not exceed 2mb </p>) : (filePercentage > 0 && filePercentage < 100) ? (<p className='text-slate-700 text-sm self-center'>Uploading {filePercentage}%</p>) : ((filePercentage == 100) ? (<p className='text-green-700 text-sm self-center'>Image successfully uploaded!</p>) : (null))}

        <input className='p-3 rounded-lg border' type='text' placeholder='Username' id='username' defaultValue={currentUser.username} onChange={handleChange
        } />
        <input className='p-3 rounded-lg border' type='email' placeholder='Email' id='email' defaultValue={currentUser.email} onChange={handleChange
        } />
        <input className='p-3 rounded-lg border' type='password' placeholder='Password' id='password' onChange={handleChange
        } />
        <button disabled={loading} type='submit' className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 font-semibold disabled:opacity-80'>{loading ? 'Loding' : 'Update'}</button>
        <Link to={'/create-listing'} className='bg-green-700 text-center text-white uppercase font-semibold p-3 rounded-lg hover:opacity-95'>
        Create Listing
        </Link>
        <div className='flex justify-between text-red-700 mt-5 font-semibold'>
          <span onClick={handleUserDelete} className='cursor-pointer'>Delete account</span>
          <span onClick={handleUserSignOut} className='cursor-pointer'>Sign out</span>
        </div>
      </form>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
      {isUpdateSucces && <p className='text-green-700 mt-4'>Profile updated successfully!</p>}
      <button onClick={handleShowListings} className='text-green-700 w-full mt-5 hover:opacity-80' type='button'>Show Listings</button>
      {myListingsError && <p className='text-red-700 mt-1 text-sm text-center'>{myListingsError}</p>}
      {myListings && myListings.length > 0 && (
        <div className='my-7'>
          <h1 className='text-3xl font-semibold text-center mt-7'>My Listings</h1>
          <div className='my-5 flex flex-col gap-4'>
            {myListings.map((listing, index) => {
              return (
                <div className='border border-gray-300 rounded-lg p-3 flex justify-between' key={index}>
                  <div className='flex items-center gap-4'>
                    <Link to={`/listing/${listing._id}`}  ><img className='h-20 w-20 object-cover rounded-sm hover:'  src={listing.imageUrls[0]} alt='listing-img' /></Link>
                    <Link to={`/listing/${listing._id}`}  className='font-semibold text-slate-700 hover:underline truncate'>{listing.title}</Link>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <button className='text-red-700' type='button'>DELETE</button>
                    <button className='text-green-700' type='button'>EDIT</button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  )
}
