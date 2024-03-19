const express = require('express')
const app = express()
const mongoConnect = require("./database/connect.js")
const cors = require('cors');
require('dotenv').config()


mongoConnect()
app.use(express.json())
app.use(cors());
process.env.TZ = 'Asia/Kolkata'


app.use("/api/auth", require("./api/auth.js"))
app.use("/api/attendance", require("./api/attendance.js"))

app.get("/api", (req, res)=>{
  return res.send("Backend for attendance app...")
})



app.listen(80, () => {
  console.log(`Server Runinng on: http://localhost:80`)
})