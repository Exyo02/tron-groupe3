//La page de connexion première chose vue lorsque l'on arrive sur le jeu

const loginSection = document.getElementById("login");
var loginButton 

import { sendLoginToServer } from "./gestionWebsocket.js";

export function loadLoginSection(){
    loginSection.style.display = "flex";

    //éviter empilement des listeners si on revient sur la page login
    if (!loginButton)
      addEventForLoginButton();
}

export function closeLoginSection(){
    loginSection.style.display = "none";
}

function addEventForLoginButton() {
    loginButton = document.getElementById("loginButton");
    loginButton.addEventListener("click", () => {
        enterLogin();
    });
}

function enterLogin() {

    // Supprimer un ancien message d'erreur
    const oldMsg = document.getElementById("invalidLoginMessage");
    if (oldMsg) oldMsg.remove();

    // Vérification si champs vides
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) {
        showError("Veuillez remplir les deux champs.");
        return;
    }

    // Validation du format pour le nom d'utilisateur et le mot de passe
    const usernameRegex = /^[a-z][A-Za-z0-9]{2,19}$/;
    if (!usernameRegex.test(username)) {
        showError("Le nom d'utilisateur doit commencer par une minuscule et contenir 3 à 20 caractères alphanumériques.");
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        showError("Le mot de passe doit faire au moins 6 caractères et contenir au minimum une lettre et un chiffre.");
        return;
    }

    // Envoi du login au serveur
    const message = {
        type: "login",
        username: username,
        password: password,
    };

    //on appelle cette fonction qui est dans gestionWebSocket
    sendLoginToServer(message);
}

//Cette fonction peut être appelée par erreur de regex ou alors par retour du serveur qui dit que le mot de passe est incorrect ou que l'utilisateur est déjà connecté
export function showError(msg) {
        let invalidLoginMessage = document.createElement("p");
        invalidLoginMessage.id = "invalidLoginMessage";
        invalidLoginMessage.innerText = msg;
        loginSection.appendChild(invalidLoginMessage);
}