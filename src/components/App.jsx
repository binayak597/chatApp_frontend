
import React from 'react'
import { createBrowserRouter as Router, RouterProvider } from 'react-router-dom'
import Register from '../pages/Register'
import Chat from '../pages/Chat'
import PageNotFound from '../pages/PageNotFound'
import Authenticate from '../middlewares/Authenticate.jsx'
import Login from '../pages/Login'


const App = () => {

  const router = Router([
    {
      path: "/",
      element: <Login />
    }, 
    {
      path: "/register",
      element: <Register />
    }, 
    {
      path: "/chat",
      element: <Authenticate><Chat /></Authenticate>
    },
    {
      path: "*",
      element: <PageNotFound />
    }
  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App