import React, { useEffect, useState } from 'react'
import Login from '../auth/Login';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/Header';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const navigate = useNavigate();
    useEffect(() => {
        if(!token) {
            navigate("/");
        }
    }, [token])
  
  return (
    <div className=''>
      {token ? 
        <div className="flex w-[100%] h-screen overflow-hidden">
          <Sidebar />

          <main className="flex-1 w-full p-4 bg-[#F2F1ED] overflow-y-auto">
            <Outlet />
          </main>
        </div>
       : 
        <div className=''>
        <Login />
        </div>
      }
    </div>
  )
}

export default AdminLayout
