const express = require('express')
const app = express()
const User = require("../database/models/UserSchema.js")
const jwt = require("jsonwebtoken")


app.post("/getAttendance", async (req, res) => {
  try {
    const userId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET);
    const user = await User.findOne({ _id: userId._id }).select('-password');

    if (!user) return res.status(400).json({ success: false, error: 'Your session has expired!' });

    const today = new Date().setHours(0, 0, 0, 0);
    const attendance = user.attendance.map(entry => ({ date: new Date(entry.date).toISOString().split('T')[0], title: "present" }));

    let currentDate = new Date(user.registerDate);
    while (currentDate <= today) {
      const datePart = new Date(currentDate).toISOString().split('T')[0];
      if (!user.attendance.some(entry => new Date(entry.date).toISOString().split('T')[0] === datePart)) {
        attendance.push({ date: datePart, title: "absent" });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json({ success: true, attendance, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
});



app.post("/getAttendanceById", async (req, res) => {
  try {
    const adminId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET);
    let admin = await User.findOne({ _id: adminId._id }).select('-password');

    if (!admin || !admin.admin) {
      return res.status(400).json({ success: false, error: admin ? 'Unauthorized Access!' : 'Your session has expired!' });
    }

    const user = await User.findOne({ _id: req.body.id }).select('-password');

    const today = new Date().setHours(0, 0, 0, 0);
    const attendance = user.attendance.map(entry => ({ date: new Date(entry.date).toISOString().split('T')[0], title: "present" }));

    let currentDate = new Date(user.registerDate);
    while (currentDate <= today) {
      const datePart = new Date(currentDate).toISOString().split('T')[0];
      if (!user.attendance.some(entry => new Date(entry.date).toISOString().split('T')[0] === datePart)) {
        attendance.push({ date: datePart, title: "absent" });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json({ success: true, attendance, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
});



app.post("/addAttendance", async (req, res) => {
  try {
    const userId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET);
    let user = await User.findOne({ _id: userId._id }).select('-password');
    if (!user) {
      return res.status(400).json({ success: false, error: 'Your session has expired!' });
    }

    const today = new Date();

    const existingAttendance = user.attendance.find(entry => {
      return entry.date.getDate() === today.getDate();
    });
    if (existingAttendance) {
      return res.status(400).json({ success: false, error: 'Attendance for today already exists.' });
    }

    user.attendance.push({ date: today, title: 'present' });
    await user.save();

    return res.json({ success: true, error: 'Attendance added successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
});

module.exports = app