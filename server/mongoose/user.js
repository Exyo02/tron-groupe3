const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});





const User = mongoose.model('User', userSchema);





function verifierLogin(connection, messageObject) {

    let username = messageObject.username
    let password = messageObject.password
    var user = User.findOne({ username: username });

    user.exec(function (err, user) {
        if (!user) {
            //create new user
            const newUser = new User({
                username: username,
                password: password, // hash obligatoire?
            });
            newUser.save();
            console.log(`New user ${username} created`);
            connection.sendUTF(JSON.stringify({ type: "loginSuccess", username }));
            connection.login = username;
        } else {

            if (user.password == password) {
                console.log("user connecté");
                connection.sendUTF(JSON.stringify({ type: "loginSuccess", username }));
                connection.login = username;
            }
            else {
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

module.exports = verifierLogin;