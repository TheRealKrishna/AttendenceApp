import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../logo.svg";
import { toast } from 'react-hot-toast';

export default function Navbar({user}) {
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = () => {
    sessionStorage.removeItem("auth-token");
    toast("Logged Out Successfully");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark fixed-top position-sticky" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img style={{ width: "35px", marginRight: "15px" }} src={logo} alt="iNoteBook" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/" onClick={handleNavCollapse}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about" onClick={handleNavCollapse}>About</Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            {sessionStorage.getItem("auth-token") ? (
              <Link to={user.admin ? "/admin/dashboard" : "/user/dashboard"}><button className="btn btn-primary mx-2" onClick={handleNavCollapse}>Dashboard</button></Link>
            ) : (
              <Link to="/login"><button className="btn btn-primary mx-2" onClick={handleNavCollapse}>Login</button></Link>
            )}
            {sessionStorage.getItem("auth-token") ? (
              <Link onClick={handleLogout} to="/"><button className="btn btn-danger btn-outline mx-2" onClick={handleNavCollapse}>Logout</button></Link>
            ) : (
              <Link to="/signup"><button className="btn btn-primary mx-2" onClick={handleNavCollapse}>Sign Up</button></Link>
            )}
          </form>
        </div>
      </div>
    </nav>
  )
}
