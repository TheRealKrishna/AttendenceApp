const express = require('express')
const app = express()
const { body, validationResult } = require('express-validator')
const User = require("../database/models/UserSchema.js")
const errorHandler = require("../handler/errorHandler.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

app.post("/signup", body('email').isEmail(), body('password').isLength({ min: 8 }), body('name').isLength({ min: 1 }), async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase();

    const errors = validationResult(req)
    if (!errors.isEmpty() && errors.errors[0].path === 'name') {
      return res.status(400).json({ success: false, error: 'Name is required.' })
    }
    if (!errors.isEmpty() && errors.errors[0].path === 'email') {
      return res.status(400).json({ success: false, error: 'Invalid email address. Please try again.' })
    }
    if (!errors.isEmpty() && errors.errors[0].path === 'password') {
      return res.status(400).json({ success: false, error: 'Password must be atleast 8 characters long.' })
    }


    const emailCheck = await User.findOne({ email: req.body.email })
    if (emailCheck) {
      return res.status(400).json({ success: false, error: 'An account already exists with that email.' })
    }

    const securePassword = bcrypt.hashSync(req.body.password, 10);


    const user = await User.create({ ...req.body, password: securePassword });
    await user.save();


    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);


    return res.json({ success: true, authToken: token, admin: user.admin })
  }
  catch (error) {
    errorHandler(error)
    return res.status(500).json({ success: false, error: "An internal server error occured." })
  }

})

app.post("/login", body('password').isLength({ min: 8 }), body('email').isEmail(), async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase();

    const errors = validationResult(req)
    if (!errors.isEmpty() && errors.errors[0].path === 'password') {
      return res.status(400).json({ success: false, error: 'Invalid credentials.' })
    }
    if (!errors.isEmpty() && errors.errors[0].path === 'email') {
      return res.status(400).json({ success: false, error: 'Invalid credentials.' })
    }


    let user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials.' })
    }


    const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordCheck) {
      return res.status(400).json({ success: false, error: 'Invalid credentials.' })
    }


    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);


    return res.json({ success: true, authToken: token, admin: user.admin })
  }
  catch (error) {
    errorHandler(error)
    return res.status(500).json({ success: false, error: "An internal server error occured." })
  }
})

app.post("/getUser", async (req, res) => {
  try {
    const userId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET)
    let user = await User.findOne({ _id: userId._id }).select('-password');
    if (!user) {
      return res.status(400).json({ success: false, error: 'Your session has expired!' })
    }

    return res.json({ success: true, user: user })
  }
  catch (error) {
    errorHandler(error)
    return res.status(500).json({ success: false, error: "An internal server error occured." })
  }
})

app.post("/getAllUser", async (req, res) => {
  try {
    const adminId = jwt.verify(req.headers["auth-token"], process.env.JWT_SECRET)
    let admin = await User.findOne({ _id: adminId._id }).select('-password');
    if (!admin) {
      return res.status(400).json({ success: false, error: 'Your session has expired!' })
    }
    if (!admin.admin) {
      return res.status(400).json({ success: false, error: 'Unauthorized Access!' })
    }

    let users = await User.find({ admin: false }).select('-password');

    return res.json({ success: true, users: users })
  }
  catch (error) {
    errorHandler(error)
    return res.status(500).json({ success: false, error: "An internal server error occured." })
  }
})

module.exports = app