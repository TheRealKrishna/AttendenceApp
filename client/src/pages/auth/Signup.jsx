import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/user/dashboard")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.name || !credentials.email || !credentials.password || credentials.password.length < 8) {
      toast.error('All the fields are required.');
    } else {
      try {
        toast.promise(
          new Promise(async (resolve, reject) => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (data.success) {
              sessionStorage.setItem('auth-token', data.authToken);
              if (data.admin) {
                navigate('/admin/dashboard')
              }
              else {
                navigate('/user/dashboard')
              }
              resolve("Account created successfully!")
            } else {
              reject(data.error);
            }
          }),
          {
            loading: 'Creating Account...',
            success: 'Account created successfully!',
            error: (error) => error.toString(),
          }
          )
      } catch (error) {
        toast.error('An error occurred during signup. Please try again.');
      }
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" className="form-control" value={credentials.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" className="form-control" value={credentials.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" className="form-control" value={credentials.password} onChange={handleChange} minLength="8" required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
