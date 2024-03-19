import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import About from './pages/About';
import toast, { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { useEffect, useState } from 'react';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import UserAttendance from './pages/admin/UserAttendance';

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('auth-token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
          headers: { 'auth-token': token },
          method: "POST"
        });
        const json = await response.json();
        if (json.success) setUser(json.user);
        else {
          toast.error(json.error);
          sessionStorage.removeItem("auth-token");
        }
      } catch (error) {
        toast.error("Your session has expired!");
        sessionStorage.removeItem("auth-token");
      }
    };
    if (sessionStorage.getItem("auth-token")) {
      fetchData();
    }

  }, []);


  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route exact path="/" element={<HomePage user={user} />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route path="/user/dashboard" element={<UserDashboard user={user} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
        <Route path="/admin/userAttendance/:id" element={<UserAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
