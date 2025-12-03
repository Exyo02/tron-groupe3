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


    User.findOne({ username: username }).then(
        function (user) {
            console.log(user);
            if (!user) {
                //create new user
                const newUser = new User({
                    username: username,
                    password: password, // hash obligatoire?
                });
                newUser.save();
                console.log(`New user ${newUser.username} created`);
                connection.sendUTF(JSON.stringify({ type: "loginSuccess", username: newUser.username }));
                connection.login = newUser.username;
            } else {

                //Check if password is the same
                if (user.password == password) {
                    console.log(`Utilisateur connecté ${user.username}`);
                    connection.sendUTF(JSON.stringify({ type: "loginSuccess", username: user.username }));
                    connection.login = user.username;
                }
                else {
                    console.log("mauvais mdp ");
                    connection.sendUTF(JSON.stringify({ type: "loginError" }));
                }

            }
        }
    ).catch((err) => {
        console.log(err);
    })

}

module.exports = verifierLogin;