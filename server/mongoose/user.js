const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

//Tableaux des pseudos déjà connectés pour éviter qu'une même personne se connecte deux fois en même temps 
// sinon elle pourrait faire des parties contre elle même et gonfler ses victoires
var alreadyLog = [];

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    victoires: Number,
    defaites: Number,
    egalites: Number
});


const User = mongoose.model('User', userSchema);

function verifierLogin(connection, messageObject) {

    let username = messageObject.username
    let password = messageObject.password


    User.findOne({ username: username }).then(
        function (user) {
            if (!user) {
                //create new user
                const newUser = new User({
                    username: username,
                    password: password,
                    victoires: 0,
                    defaites: 0,
                    egalites: 0
                });
                newUser.save();
                connection.sendUTF(JSON.stringify({ type: "loginSuccess", username: newUser.username }));
                connection.login = newUser.username;
                if (!alreadyLog.includes(connection.login)) {
                    alreadyLog.push(connection.login);
                }
            } else {

                //Check if password is the same
                if (user.password == password) {
                    //Si l'user est déjà connecté on refuse
                    if (alreadyLog.indexOf(user.username) != -1) {
                        connection.sendUTF(JSON.stringify({
                            type: "loginError",
                            message: "Cet utilisateur est déjà connecté."
                        }));

                    }
                    //ici on accepte <-------------------
                    else {
                        connection.sendUTF(JSON.stringify({ type: "loginSuccess", username: user.username }));
                        connection.login = user.username;
                        if (!alreadyLog.includes(connection.login)) {
                            alreadyLog.push(connection.login);
                        }
                    }

                } //mdp incorrect on refuse
                else {
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

//Mise a jours des stats
async function ajouterVictoire(pseudo) {
    await User.updateOne({ username: pseudo }, { $inc: { victoires: 1 } });
}

async function ajouterDefaite(pseudo) {
    await User.updateOne({ username: pseudo }, { $inc: { defaites: 1 } });
}

async function ajouterEgalite(pseudo) {
    await User.updateOne({ username: pseudo }, { $inc: { egalites: 1 } });
}


//Lors de la déconnexion
function retirerLogin(connection) {
    console.log("=== RETIRER LOGIN AVANT ===");
    console.log("alreadyLog:", alreadyLog);
    console.log("connection.login:", connection.login);

    if (alreadyLog.includes(connection.login))
        alreadyLog = alreadyLog.filter(pseudo => pseudo != connection.login);


    console.log("=== RETIRER LOGIN APRÈS ===");
    console.log("alreadyLog:", alreadyLog);
}


function sendLogoutSuccess(connection) {
    const message = {
        type: "logoutSuccess"
    };
    connection.sendUTF(JSON.stringify(message));
}



//Récupérer les stats du joueur
async function handleGetStatsRequest(connection) {
    User.findOne({ username: connection.login }).then(
        function (user) {
            if (!user) {
                console.log("user inconnu");
            }
            else {
                connection.sendUTF(JSON.stringify({
                    type: "getStats",
                    victoires: user.victoires,
                    defaites: user.defaites,
                    egalites: user.egalites
                }));
            }
        }
    )
        .catch((err) => {
            console.log(err);
        })
}


//Récupérer les meilleurs joueurs en nombre de victoires
async function handleGetBestPlayersRequest(connection) {
    //On récupére les joueurs en classant par victoires
    const players = await User.find()
        .sort({ victoires: -1 })
        .select('-password')  //on évite d'envoyer les passwords à tous le monde !
        .limit(5); // on envoit que les 5 meilleurs
    connection.sendUTF(JSON.stringify({
        type: "getBestPlayers",
        players: players
    }))
}



module.exports = { verifierLogin, retirerLogin, sendLogoutSuccess, ajouterVictoire, ajouterDefaite, ajouterEgalite, handleGetStatsRequest, handleGetBestPlayersRequest };