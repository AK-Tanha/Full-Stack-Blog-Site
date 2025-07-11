import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({children}) => {
    const {user} = useSelector((state) => state.auth);
    const location = useLocation();
    if (user) {
        return children
    }
  return (
    <Navigate to="/log-in" state={{from:location}} replace/>
    
  )
}

export default PrivateRoutes
