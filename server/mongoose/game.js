const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({ 
    player1: String,
    player2: String,
    winner: Number,
    endTime: Date
});