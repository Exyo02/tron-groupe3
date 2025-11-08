const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    username: String,
    password: String,
    lastlogin: Date,
    created: Date
});