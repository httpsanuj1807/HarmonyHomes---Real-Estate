import {useSelector} from 'react-redux';
export default function Profile() {
  const{ currentUser } = useSelector(state => state.user); 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-semibold text-3xl my-7 text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img className='rounded-full h-24 w-24 self-center object-cover cursor-pointer mt-2' src={currentUser.avatar} alt='profile-img'></img>
        <input className='p-3 rounded-lg border' type='text' placeholder='Username' id='username' />
        <input className='p-3 rounded-lg border' type='email' placeholder='Email' id='email' />
        <input className='p-3 rounded-lg border' type='password' placeholder='Password' id='password' />
        <button className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
        <div className='flex justify-between text-red-700 mt-5'>
          <span className='cursor-pointer'>Delete account</span>
          <span className='cursor-pointer'>Sign out</span>
        </div>
      </form>
    </div>
  )
}
