import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button } from "react-bootstrap";

export default function AdminDashboard({ user }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {

    } else navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getAllUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("auth-token") // Assuming you store the token in localStorage
          }
        });
        const json = await response.json()
        if (json.success) {
          setUsers(json.users);
        }
        else {
          navigate("/user/dashboard")
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        navigate("/user/dashboard")
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div>
        <h1>User List</h1>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.registerDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                <td>
                  <Link to={`/admin/userAttendance/${user._id}`}><Button variant="primary">View Attendance</Button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
