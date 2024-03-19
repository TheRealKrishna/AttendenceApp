const express = require('express')
const app = express()
const User = require("../database/models/UserSchema.js")
const jwt = require("jsonwebtoken")


app.post("/getAttendance", async (req, res) => {
  try {
    const userId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET);
    let user = await User.findOne({ _id: userId._id }).select('-password');
    if (!user) {
      return res.status(400).json({ success: false, error: 'Your session has expired!' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = [];
    const joinDate = user.registerDate;
    let currentDate = new Date(joinDate);

    const userAttendance = user.attendance.map(entry => {
      const dateISOString = new Date(entry.date).toISOString();
      return { date: dateISOString.split('T')[0], title: "present" }
    });

    attendance.push(...userAttendance)

    while (currentDate <= today) {
      const attendanceEntry = user.attendance.find(entry => entry.date.getTime() === currentDate.getTime());
      if (!attendanceEntry) {
        const dateISOString = new Date(currentDate).toISOString();
        const datePart = dateISOString.split('T')[0];
        if (!userAttendance.some(entry => entry.date === datePart)) {
          attendance.push({ date: datePart, title: "absent" });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json({ success: true, attendance: attendance, user:user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
});


app.post("/getAttendanceById", async (req, res) => {
  try {
    const adminId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET);
    let admin = await User.findOne({ _id: adminId._id }).select('-password');
    if (!admin) {
      return res.status(400).json({ success: false, error: 'Your session has expired!' });
    }

    if (!admin.admin) {
      return res.status(400).json({ success: false, error: 'Unauthorized Access!' });
    }

    let user = await User.findOne({ _id: req.body.id }).select('-password');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = [];
    const joinDate = user.registerDate;
    let currentDate = new Date(joinDate);

    const userAttendance = user.attendance.map(entry => {
      const dateISOString = new Date(entry.date).toISOString();
      return { date: dateISOString.split('T')[0], title: "present" }
    });

    attendance.push(...userAttendance)

    while (currentDate <= today) {
      const attendanceEntry = user.attendance.find(entry => entry.date.getTime() === currentDate.getTime());
      if (!attendanceEntry) {
        const dateISOString = new Date(currentDate).toISOString();
        const datePart = dateISOString.split('T')[0];
        if (!userAttendance.some(entry => entry.date === datePart)) {
          attendance.push({ date: datePart, title: "absent" });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.json({ success: true, attendance: attendance, user:user });
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