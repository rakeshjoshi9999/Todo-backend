const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors);

var config = require('./config');
// var routes = require('./routes');

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Dev Server is Live"
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started and running on Port: 3000");
})

