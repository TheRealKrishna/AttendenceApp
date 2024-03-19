const Mongoose = require("mongoose")

function mongoConnect(){
    Mongoose.connect(process.env.MONGO_URI).then((result) => {
        console.log("MongoDB Connected")  
    }).catch((err) => {
        console.log(err)
    });
}

module.exports=mongoConnect