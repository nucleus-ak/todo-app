const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {auth, JWT_STRING} = require('./auth');
const {UserModel, TodoModel} = require('./db');

mongoose.connect('mongodb+srv://nucleus25:KK68nVPcUqC00zNG@cluster0.dbuq4aw.mongodb.net/todo-app-db');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await UserModel.create({
        name: name,
        email: email,
        password: password
    });

    res.json({
        msg: "You are signed up"
    });
});

app.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    });
    console.log(user);
    if(user) {
        const token = jwt.sign({
            id: user._id      // _id is an id from mongodb
        }, JWT_STRING);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            msg: "Invalid Creds"
        });
    }
});

app.post('/todo', auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    await TodoModel.create({
        title,
        userId
    });

    res.json({
        msg: "Todo Created"
    });
});

app.get('/todos', auth, async (req, res) => {
    const todos = await TodoModel.find({
        userId: req.userId
    });
    res.json({
        todos
    })
});

app.listen(3000);