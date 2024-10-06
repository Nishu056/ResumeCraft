import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedLayout = () => {

    const ifAdmin = localStorage.getItem('admin')

    if(!ifAdmin) {
        return <Navigate  to="/" />
    }
  return (
    <Outlet />
  )
}

export default ProtectedLayout
