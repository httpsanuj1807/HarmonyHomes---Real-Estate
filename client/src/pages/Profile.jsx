import {useSelector} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { app } from '../firebase.js'


export default function Profile() {
  const{ currentUser } = useSelector(state => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [wrongFileType, setWrongFileType] = useState(false);
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
    const fileName = file.name;
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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-semibold text-3xl my-7 text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} hidden ref={fileRef} type='file' accept='images/*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 self-center object-cover cursor-pointer mt-2' src={formData.avatar || currentUser.avatar} alt='profile-img'></img>
        {(wrongFileType) ? (<p className='text-red-700 text-sm self-center'>Only images are allowed</p>) : (null)}
        {(fileUploadError) ? (<p className='text-red-700 text-sm self-center'>Error image upload. File size must not exceed 2mb </p>) : (filePercentage > 0 && filePercentage < 100) ? (<p className='text-slate-700 text-sm self-center'>Uploading {filePercentage}%</p>) : ((filePercentage == 100) ? (<p className='text-green-700 text-sm self-center'>Image successfully uploaded!</p>) : (null))}

        <input className='p-3 rounded-lg border' type='text' placeholder='Username' id='username' />
        <input className='p-3 rounded-lg border' type='email' placeholder='Email' id='email' />
        <input className='p-3 rounded-lg border' type='password' placeholder='Password' id='password' />
        <button className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 font-semibold disabled:opacity-80'>Update</button>
        <div className='flex justify-between text-red-700 mt-5 font-semibold'>
          <span className='cursor-pointer'>Delete account</span>
          <span className='cursor-pointer'>Sign out</span>
        </div>
      </form>
    </div>
  )
}
