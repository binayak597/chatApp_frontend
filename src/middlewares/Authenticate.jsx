import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import Login from '../pages/Login';


const Authenticate = ({children}) => {
    const {userName} = useContext(UserContext);
  if(userName){
    return children;
  }
  return <Login />
}

export default Authenticate