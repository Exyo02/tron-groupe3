const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

var alreadyLog = [];
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    victoires: Number,
    defaites: Number
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
                    password: password,
                    victoires: 0,
                    defaites: 0
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
                        console.log("mon nb victoire " + user.victoires);
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
//a faire
async function ajouterVictoire(pseudo) {
    User.updateOne({ username: pseudo }, { $inc: { victoires: 1 } })
        .then().catch ((err) => {
        console.log(err);
    });

}

async function ajouterDefaite(pseudo) {
    User.updateOne({ username: pseudo }, { $inc: { defaites: 1 } })
        .then().catch ((err) => {
        console.log(err);
    });

}

function retirerLogin(connection) {
    if (alreadyLog.includes(connection.login))
        alreadyLog = alreadyLog.filter(pseudo => pseudo != connection.login);
}

module.exports = { verifierLogin, retirerLogin, ajouterVictoire, ajouterDefaite };