# Client

| Nom | Type/Paramètres | Description | Appelée depuis |
|-----|----------------|-------------|----------------|
| Player(client) | classe | Joueur côté client | Game.constructor |
| Game(client) | classe | Gère 2 joueurs | startGame |
| setNextPosition() | fonction | Avance joueur | Game.update |
| update(dir1,dir2) | fonction | Met à jour positions | handleServerTick |
| addAndPaintBackGround() | - | Dessine grille | startGame |
| updateClasses() | - | Met à jour DOM | handleServerTick |
| enterLobby() | - | Envoie enterLobby | start button |
| startGame(numero) | (num) | Init partie | serveur → startGame |
| handleServerTick(data) | (data) | Met à jour positions | serveur → direction |
| sendDirection(direction) | (direction) | Envoie direction | setupInputControls |
| endGame() | (...) | Fin de partie UI | serveur → endGame |
| setupInputControls() | - | Gère clavier | startGame |
| main() | - | Init application | script principal |
| connectWebSocket() | - | Ouvre WebSocket | htmlAndLoopHandler |
| onMessage(callback) | (callback) | Abonne handler | setupServerMessageHandling |
| setupServerMessageHandling() | - | Gère messages serveur | htmlAndLoopHandler |
| playerNumber | variable | Numéro joueur | sendDirection/htmlAndLoopHandler |
| onMessageCallback | variable | Callback messages serveur | onmessage |
| afficherParties() | - | user souhaite consulter son historique après s’être connecté | main | 
| displayGameHistory(gameResults) |　gameResults | Afficher tout en ajoutant dans un div côté client|　server → gameHistory |


# Serveur

| Nom | Type/Paramètres | Description | Appelée depuis |
|-----|----------------|-------------|----------------|
| Game (serveur) | classe | Logique jeu serveur | lancerPartie |
| Player (serveur) | classe | Joueur serveur | Game.constructor |
| updatePosition() | - | Avance joueur | UpdateAndcheckIfSomeoneDead |
| startGame() | - | Démarre jeu | lancerPartie |
| sendAllDirections(game) | (game) | Tick serveur | setInterval |
| sendEndOfGameMessage() | (perdant) | Notifie fin | sendAllDirections |
| lancerPartie() | - | Crée partie | auto quand lobby=2 |
| ajouterClientAuLobby(conn) | (connection) | Ajoute au lobby | client → enterLoby |
| modifySomeoneDirection() | (nbPlayer,dir) | Change direction | findAndUpdateGame |
| UpdateAndcheckIfSomeoneDead() | - | Avance joueurs + collisions | sendAllDirections |
| findAndUpdateGame(conn,n,d) | (conn,n,d) | Change direction joueur | client → changeDirection |
| verifierLogin(connection, messageObject)| (connection, messageObject)| login ou creation utilisateur | client → login|
| saveGameResult(pl1, pl2, winner) | (String String String) | sauvgarder la partie | ? |
| getUserGameHistory(username) | (String) | lister historique de parties | handleGameHistoryRequest |
| handleGameHistoryRequest(connection) | connection| | serveur traite la demande d’historique du client| client → getGameHistory