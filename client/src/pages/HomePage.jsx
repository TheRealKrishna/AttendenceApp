import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

function HomePage({user}) {
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("auth-token");
    toast("Logged Out Successfully");
  }
  return (
    <div className='container mt-5'>
      <h1>Welcome to Attendance Application</h1>
      <p>Please login or sign up to continue.</p>
      {/* <a href="/login" className="btn btn-primary mr-2" style={{marginRight:"10px"}}>Login</a> */}
      {/* <a href="/signup" className="btn btn-secondary">Sign Up</a> */}
      {sessionStorage.getItem("auth-token") ? (
        <Link to={user.admin ? "/admin/dashboard" : "/user/dashboard"}><button className="btn btn-primary"  style={{marginRight:"10px"}}>Dashboard</button></Link>
      ) : (
        <Link to="/login"><button className="btn btn-primary" style={{marginRight:"10px"}}>Login</button></Link>
      )}
      {sessionStorage.getItem("auth-token") ? (
        <Link onClick={handleLogout} to="/"><button className="btn btn-danger btn-outline">Logout</button></Link>
      ) : (
        <Link to="/signup"><button className="btn btn-primary">Sign Up</button></Link>
      )}
    </div>
  );
}

export default HomePage;
