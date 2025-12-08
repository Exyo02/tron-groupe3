## PROJET « JEU TRON »
#### groupe3

Ce document explique comment déployer et exécuter le jeu Tron sur une machine locale ou sur un réseau local (WiFi).

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

À la racine du projet :

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

##### Option 1 : avec Cordova

```
cordova run browser
```

##### Option 2 : serveur HTTP en Node

```
npx http-server .
```

Le site sera accessible sur :

```
http://127.0.0.1:8080
ou
http://192.168.X.X:8080 (depuis le smartphone)
```


## 6. Test sur smartphone (même Wi-Fi)

##### 1. Trouvez l’adresse IP locale du PC 
Exemple : `192.168.1.116`


##### 2. Vérifiez la configuration du WebSocket
Dans **/server/Server.js** :

```
server.listen(9898, "0.0.0.0");
```

Dans **/client/www/js/gestionWebsocket.js** :


```
socket = new WebSocket("ws://192.168.1.116:9898");
```

##### 3. Depuis le smartphone, ouvrez l’URL du front-end  
Exemple :

```
http://192.168.1.116:8080
```

Le smartphone peut maintenant jouer contre le PC.

---

## Troubleshooting

##### MongoDB refuse de démarrer

Erreur "Address already in use" → Mongo tourne déjà
Fermer l'ancien processus ou changer le port