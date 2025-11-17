

const userSchema = new mongoose.Schema({ 
    username: String,
    password: String,
});




// //Server.js
// const mongoose = require('mongoose');
// const mongoose = require('./mongoose/user');





const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');



function verifierLogin(connection, messageObject) {

    let username = messageObject.username
    let password = messageObject.password
    var user = User.findOne({ username: username });
    
    user.exec(function (err, user) {
    if (!user){
        //create new user
        const newUser = new User({
            username: username,
            password: password, // hash obligatoire?
            });
        newUser.save();
        console.log(`New user ${username} created`);
        connection.sendUTF(JSON.stringify({ type: "loginSuccess", username })); //
    } else{
        try{
            User.find({ password: password })
            console.log(`User ${username} logged in`);
            connection.sendUTF(JSON.stringify({ type: "loginSuccess", username }));
        }catch{
              connection.sendUTF(JSON.stringify({ type: "loginError" }));
        }
    }
    if (err) {
        console.error(err);
        connection.sendUTF(JSON.stringify({ type: "loginError" }));
        return;
    }
    })
}