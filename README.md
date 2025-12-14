## PROJET « JEU TRON »
#### groupe3

Ce document explique comment déployer et exécuter le jeu Tron.

---

## 1. Pré-requis

Assurez-vous d’avoir installé :

- Node.js
- npm
- MongoDB Community Edition
- Un terminal (bash, zsh…)


## 2. Installation des dépendances

Dans le dossier "client", puis dans le dossier "server":

```
npm install
```

## 3. Création du dossier pour stocker les données MongoDB

Sur votre machine :

```
mkdir tronGameUser
```

Démarrez ensuite le serveur MongoDB :
```
mongod --dbpath ./tronGameUser
```

## 4. Démarrer le serveur Node.js

Dans le dossier "server" du projet :

```
node Server.js
```
le serveur WebSocket écoute sur le port 9898.

## 5. Lancer le front-end
Dans le dossier "client" du projet 
Au préalable `cordova platform add browser`et `cordova platform add android`

**Trouvez l’adresse IP locale du serveur**  :

Exemple : `192.168.1.116`

Mettre la bonne adresse dans **/client/www/js/gestionWebsocket.js** :

```
socket = new WebSocket("ws://192.168.1.116:9898");
```
*Pour jouer uniquement en local sur le navigateur avec deux fenêtres ouvertes pas besoin de changer l'ip vous pouvez laisser le local*

### A : pour le pc :

```
cordova run browser
```

### B : Pour le smartphone :

Lancer `cordova run android` avec le téléphone branché en usb.
Lancer l'application

Le smartphone peut maintenant jouer contre le PC.
Sur téléphone on contrôle avec le swipe pendant les parties.

## 6. Créer des users

Créer au moins deux users pour jouer l'un contre l'autre :
pseudo sans majuscules entre 3 et 20 caractères,  et mot de passe contenant chiffre & lettres d'au moins 6 caractères.
