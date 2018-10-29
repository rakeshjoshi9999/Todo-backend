const _ = require('lodash');
const express = require('express');
// JOI
const expressJoi = require('express-joi');
let Joi = expressJoi.Joi;
const async = require('async');

// jwt & passport
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const models = require('../models');
const status = require('../config/status');
const auth = require('../config/auth');

const router = express.Router();


// passport

let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = auth.Secret;

router.use(passport.initialize());

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    let user = models.User.User.findOne({
        _id: jwt_payload.id
    }, (err, agent) => {
        console.log(agent);
        if (agent) {
            next(null, agent);
        } else {
            next(null, false);
        }
    });
});
passport.use('userjwt', strategy);

// Signup

var JOI = {
    first_name: expressJoi.Joi.types.String().min(3).max(10).required(),
    last_name: expressJoi.Joi.types.String().min(3).max(10).required(),
    email: expressJoi.Joi.types.String().min(3).max(50).required(),
    phone: expressJoi.Joi.types.String().min(3).max(12).required(),
    password: expressJoi.Joi.types.String().min(6).max(16).required()
}


router.post('/signup', expressJoi.joiValidate(JOI), (req, res) => {
    req.body.password = md5(req.body.password);
    console.log("Body:", req.body)

    models.User.User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            res.json({
                status: status.status.ERROR.BAD_REQUEST,
                message: "Email already exists"
            })
        } else {
            models.User.User(req.body).save((err, data) => {
                if (err) {
                    res.json({
                        status: status.status.ERROR.BAD_REQUEST,
                        message: err
                    });
                } else {
                    res.json({
                        status: status.status.SUCESS.DEFAULT,
                        message: "User Signed Successfully! Login with the email and Password",
                        data: data
                    });
                }
            });
        }
    });
});



//Login

var JOI = {
    email: expressJoi.Joi.types.String().min(3).max(50).required(),
    password: expressJoi.Joi.types.String().min(6).max(16).required()
}

router.post('/login', expressJoi.joiValidate(JOI), (req, res) => {
    models.User.User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.json({
                message: err
            });
        }
        console.log(user);
        if (!user) {
            res.json({
                status: status.status.ERROR.NOT_FOUND,
                message: "Invalid Email Id!!"
            });
        } else if (user) {
            if (user.password !== md5(req.body.password)) {
                res.json({
                    status: status.status.ERROR.BAD_REQUEST,
                    message: "Invalid Password!!"
                });
            } else {
                let payload = {
                    id: user.id
                }
                let token = jwt.sign(payload, auth.Secret, { expiresIn: 60 * 60 * 24 * 30 });
                delete (user.password);

                res.json({
                    status: status.status.SUCESS.DEFAULT,
                    message: "Login Successful",
                    token: token,
                    user: user
                });
            }
        }
    });
});

// Add TODO
var JOI = {
    user_id: expressJoi.Joi.types.String().min(3).max(50).required(),
    todo_name: expressJoi.Joi.types.String().min(3).max(50).required(),
    details: expressJoi.Joi.types.String().min(5).max(50).required()
}

router.post('/add', [expressJoi.joiValidate(JOI), passport.authenticate('userjwt', { session: false })], (req, res) => {
    models.ToDo.ToDo(req.body).save((err, todo) => {
        if (err) {
            res.json({
                status: status.status.ERROR.BAD_REQUEST,
                message: err
            });
        } else {
            res.json({
                status: status.status.SUCESS.DEFAULT,
                message: "Todo added successfully",
                data: todo
            });
        }
    });
});


// Get all Todos
router.get('/getAll', [passport.authenticate('userjwt', { session: false })], (req, res) => {
    models.ToDo.ToDo.find((err, todos) => {
        if (err) {
            res.json({
                status: status.status.ERROR.BAD_REQUEST,
                message: err
            });
        } else {
            res.json({
                status: status.status.SUCESS.DEFAULT,
                message: ":::::Here are Your Todos:::::",
                todos: todos
            });
        }
    });
});


//delete Todo

var JOI = {
    todo_id: expressJoi.Joi.types.String().min(3).max(50).required()
}

router.post('/delete', [expressJoi.joiValidate(JOI), passport.authenticate('userjwt', { session: false })], (req, res) => {
    models.ToDo.ToDo.remove({ _id: req.body.todo_id }, (err, data) => {
        if (err) {
            res.json({
                status: status.status.ERROR.NOT_FOUND,
                message: err
            });
        } else {
            res.json({
                status: status.status.SUCESS.DEFAULT,
                message: "Successfylly deleted!!!",
                data: data
            });
        }
    });
});



module.exports = router;
