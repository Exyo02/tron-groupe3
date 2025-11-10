const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    username: String,
    password: String,
    lastlogin: Date,
    created: Date
});


//Server.js
const mongoose = require('./mongoose/user');
mongoose.connect('mongodb://127.0.0.1:27017/ronGameUser');
console.log('MongoDB connected');




// open a connection to the tronGameUser
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ronGameUser');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}




function verifierLogin(connection, messageObject) {

    let { username, password } = messageObject;

    var user = User.findOne({ username: username });
    
    user.exec(function (err, user) {
    if (!user){
        //create new user
        const newUser = new User({
            username: username,
            password: password, // hash obligatoire?
            created: new Date(),
            lastlogin: new Date()
            });
        newUser.save();
        console.log(`New user ${username} created`);
        connection.sendUTF(JSON.stringify({ type: "loginSuccess", username })); //
    } else{
        user.lastlogin = new Date(); 
        user.save();
        console.log(`User ${username} logged in`);
        connection.sendUTF(JSON.stringify({ type: "loginSuccess", username }));
    }
    if (err) {
        console.error(err);
        connection.sendUTF(JSON.stringify({ type: "loginError" }));
        return;
    }
    })
}