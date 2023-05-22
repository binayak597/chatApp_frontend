import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../utils/handleApi';
import { UserContext } from '../context/UserContext';
import Logo from '../components/Logo';

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useState({
    userName: "",
    password: ""
  });
  const navigate = useNavigate();
  const { userName, id, setUserName, setId } = useContext(UserContext);

  // useEffect(() => {
  //   console.log(userName, id);
  // });

  function handleChange(event) {

    const { name, value } = event.target;

    setLoggedInUser((prev) => {
      return {
        ...prev,
        [name]: value
      }
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { userDetails } = await loginUser(loggedInUser);
    setUserName(userDetails.userName);
    setId(userDetails.userId);
    navigate("/chat");

  }

  return (
    <div className='container'>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className='border-2 border-gray-100 rounded-md px-8 py-6'>
        <div className='flex items-center justify-center'>
          <Logo />
        </div>
          <div className="text-center">
            <h1 className='font-bold text-4xl'>Login</h1>
            <div className='mt-4 mb-10 text-gray-500'>
              <h4>Hi, There</h4>
              <span>Thanks for connecting with us</span>
            </div>
          </div>
          <div>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input className="w-full px-3 py-2 border border-slate-200 rounded-md 
              placeholder-slate-400 focus:outline-none
              focus:border-sky-300 focus:ring-1 focus:ring-sky-300
              invalid:border-red-400 invalid:ring-1
              invalid:ring-red-400" type="text" name="userName" value={loggedInUser.userName} placeholder="username" onChange={handleChange} autoComplete='off' />
              <input className="w-full px-3 py-2 border border-slate-200 rounded-md 
              placeholder-slate-400 focus:outline-none
              focus:border-sky-300 focus:ring-1 focus:ring-sky-300
              invalid:border-red-400 invalid:ring-1
              invalid:ring-red-400"type="password" name="password" value={loggedInUser.password} placeholder="password" onChange={handleChange} />
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg rounded-md py-3 mt-2" type="submit">Login</button>
            </form>
          </div>
          <div className="text-gray-500 m-2">
            <span>Doesn't have any acount ? <Link className="ml-1 font-bold" to="/register">Signup Now</Link></span>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login