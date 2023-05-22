import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import './index.css'
import { UserContextProvider } from './context/UserContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
  <UserContextProvider>
  <App />
  </UserContextProvider>
  </StrictMode>,
);
