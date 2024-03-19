import React from 'react'
import {Container} from "react-bootstrap"

export default function About() {
  return (
    <section className="py-5">
      <Container>
        <h2 className="mb-4">About Attendance App</h2>
        <p>Welcome to Attendance App, a user-friendly platform designed to simplify attendance management for organizations and individuals. Our app offers seamless functionality for both administrators and users, ensuring efficient tracking and management of attendance records.</p>
        <p>Key features of Attendance App include:</p>
        <ul>
          <li>User Registration and Login: Individuals can easily sign up and log in to their accounts, accessing personalized dashboards tailored to their roles.</li>
          <li>Admin Dashboard: Administrators have comprehensive access to attendance records for all users, facilitating efficient monitoring and management.</li>
          <li>User Dashboard: Users can view and manage their own attendance records, adding their daily attendance status.</li>
        </ul>
        <p>At Attendance App, we prioritize simplicity, reliability, and security, ensuring a seamless experience for all users. Join us in simplifying attendance management today!</p>
      </Container>
    </section>
  )
}
