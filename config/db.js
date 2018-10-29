const mongoose = require('mongoose');

var mongo = {
    URI: process.env.MONGO_URI || "mongodb://localhost/TODO",
    port: 27017
}

module.exports = {
    mongo: mongo
}


// Connection to DB
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/TODO", { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("Connected to MongoDB");
    }
})

