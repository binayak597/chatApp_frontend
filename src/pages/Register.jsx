import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../utils/handleApi';
import Logo from '../components/Logo';


const Register = () => {
    const [userData, setUserData] = useState({
        email: "",
        userName: "",
        password: ""
    });
    const navigate = useNavigate();
    function handleChange(event) {
        const { name, value } = event.target;
        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await registerUser(userData);
        navigate("/");
    }

    return (
        <div className='container'>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className='border-2 border-gray-100 rounded-md px-8 py-6'>
        <div className='flex items-center justify-center'>
          <Logo />
        </div>
          <div className="text-center">
            <h1 className='font-bold text-4xl'>Register</h1>
            <div className='mt-4 mb-10 text-gray-500'>
              <span>We are Happy to join us</span>
            </div>
          </div>
          <div>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input className="w-full px-3 py-2 border border-slate-200 rounded-md 
              placeholder-slate-400 focus:outline-none
              focus:border-sky-300 focus:ring-1 focus:ring-sky-300
              invalid:border-red-300 invalid:text-red-400
              focus:invalid:border-red-400 focus:invalid:ring-pink-400" type="email" name="email" value={userData.email} placeholder="email" onChange={handleChange} />
              <input className="w-full px-3 py-2 border border-slate-200 rounded-md 
              placeholder-slate-400 focus:outline-none
              focus:border-sky-300 focus:ring-1 focus:ring-sky-300
              invalid:border-red-400 invalid:ring-1
              invalid:ring-red-400" type="text" name="userName" value={userData.userName} placeholder="username" onChange={handleChange} autoComplete='off' />
              <input className="w-full px-3 py-2 border border-slate-200 rounded-md 
              placeholder-slate-400 focus:outline-none
              focus:border-sky-300 focus:ring-1 focus:ring-sky-300
              invalid:border-red-400 invalid:ring-1
              invalid:ring-red-400"type="password" name="password" value={userData.password} placeholder="password" onChange={handleChange} />
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg rounded-md py-3 mt-2" type="submit">Register</button>
            </form>
          </div>
          <div className="text-gray-500 m-2">
            <span>Already have an account ? <Link className="ml-1 font-bold" to="/">Login Now</Link></span>
          </div>
        </div>
      </div>
    </div>

    )
}

export default Register