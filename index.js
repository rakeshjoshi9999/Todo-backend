const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
require('events').EventEmitter.prototype._maxListeners = 100;


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


const config = require('./config');
const routes = require('./routes');

app.use(config.routes.todo, routes.routes);


app.get('/', (req, res) => {
    res.status(200).json({
        message: `
        ::::Send POST request to:localhost/api/todo/signup with email,first_name,last_name,phone,password to Sign UP:::::
        ::::Send POST request to:localhost/api/todo/login with email,password to login::::
        ::::Send POST request to:localhost/api/todo/add with user_id,todo_name,details to add new Todo(remember to add JWT token to Header)::::
        ::::Send GET request to :localhost/api/todo/getAll to get all Todos(remember to add JWT token to Header)::::
        ::::Send POST request to :localhost/api/todo/delete with todo_id to delete specific todo(remember to add JWT token to Header)::::
        `
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started and running on Port: 3000");
})

