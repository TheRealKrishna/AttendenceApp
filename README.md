<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendance App - README</title>
</head>
<body>
  <h1>Attendance App</h1>
  
  <p>Attendance App is a web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides a user-friendly platform for organizations and individuals to manage attendance efficiently.</p>

  <h2>Features</h2>
  <ul>
    <li><strong>User Authentication:</strong> Secure user registration and login functionality with authentication using JSON Web Tokens (JWT).</li>
    <li><strong>Role-based Access Control:</strong> Administrators have access to comprehensive attendance records for all users, while regular users can only view and manage their own attendance.</li>
    <li><strong>Admin Dashboard:</strong> A dedicated dashboard for administrators to monitor and manage attendance records for all users.</li>
    <li><strong>User Dashboard:</strong> Personalized dashboards for users to view and manage their own attendance records.</li>
    <li><strong>MongoDB Database:</strong> Utilizes MongoDB as the database for storing user information and attendance records.</li>
    <li><strong>Responsive Design:</strong> The application is designed to be responsive and compatible with various devices and screen sizes.</li>
  </ul>

  <h2>Technologies Used</h2>
  <h3>Frontend</h3>
  <ul>
    <li>React.js</li>
    <li>React Router</li>
    <li>Bootstrap</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>JSON Web Tokens (JWT) for authentication</li>
    <li>MongoDB (Mongoose ORM) for database management</li>
  </ul>

  <h2>Installation</h2>
  <ol>
    <li>Clone the repository:</li>
    <code>git clone https://github.com/your-username/attendance-app.git</code>
    
    <li>Navigate to the project directory:</li>
    <code>cd attendance-app</code>
    
    <li>Install dependencies for the server:</li>
    <code>cd server && npm install</code>
    
    <li>Install dependencies for the client:</li>
    <code>cd ../client && npm install</code>
    
    <li>Create a <code>.env</code> file in the <code>server</code> directory and provide the necessary environment variables:</li>
    <pre>
JWT_SECRET=your_jwt_secret_here
MONGO_URI=your_mongodb_uri_here
    </pre>
    
    <li>Create a <code>.env</code> file in the <code>client</code> directory and provide the necessary environment variable:</li>
    <pre>
REACT_APP_BACKEND_URL=your_backend_url_here
    </pre>
    
    <li>Start the backend server:</li>
    <code>cd ../server && npm start</code>
    
    <li>Start the frontend development server:</li>
    <code>cd ../client && npm start</code>
    
    <li>Access the application at <code>http://localhost:3000</code> in your web browser.</li>
  </ol>

  <h2>Contributing</h2>
  <p>Contributions are welcome! Feel free to open issues and pull requests for bug fixes, improvements, or new features.</p>

  <h2>License</h2>
  <p>This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>
</body>
</html>
