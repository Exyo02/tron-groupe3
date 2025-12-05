const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

var alreadyLog = [];
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
                alreadyLog.push(connection.login);
            } else {

                //Check if password is the same
                if (user.password == password) {
                    if (alreadyLog.indexOf(user.username) != -1) {
                        connection.sendUTF(JSON.stringify({
                            type: "loginError",
                            message: "Cet utilisateur est déjà connecté."
                        }));

                    }
                    else {
                        console.log(`Utilisateur connecté ${user.username}`);
                        connection.sendUTF(JSON.stringify({ type: "loginSuccess", username: user.username }));
                        connection.login = user.username;
                        alreadyLog.push(connection.login);
                    }

                }
                else {
                    console.log("mauvais mdp ");
                    connection.sendUTF(JSON.stringify({
                        type: "loginError",
                        message: "Mot de passe incorrect, veuillez réessayer."
                    }));
                }

            }
        }
    ).catch((err) => {
        console.log(err);
    })

}

function retirerLogin(connection) {
    if (alreadyLog.includes(connection.login))
        alreadyLog = alreadyLog.filter(pseudo => pseudo != connection.login);
}

module.exports = { verifierLogin, retirerLogin };