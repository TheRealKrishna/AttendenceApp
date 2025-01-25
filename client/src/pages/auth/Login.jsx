import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
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
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password || credentials.password.length < 8) {
      toast.error('Please fill in all fields and ensure that the password is at least 8 characters long.');
    } else {
      try {
        toast.promise(
          new Promise(async (resolve, reject) => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (data.success) {
              sessionStorage.setItem('auth-token', data.authToken);
              console.log(data.admin)
              resolve("Logged in successfully!")
              if (data.admin) {
                return navigate('/admin/dashboard')
              }
              else {
                return navigate('/user/dashboard')
              }
            } else {
              reject(data.error);
            }
          }),
          {
            loading: 'Logging In..',
            success: 'Login Successful!',
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" className="form-control" value={credentials.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" className="form-control" value={credentials.password} onChange={handleChange} minLength="8" required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Login</button>
      </form>
    </div>
  );
}

export default Login;
