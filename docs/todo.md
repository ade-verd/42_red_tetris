# Client side
|     | To do | Comments |
| --- | ----- | -------- |
| [ ] | Utiliser Redux | |
| [ ] | Utiliser des flexbox | "Le code HTML doit être exclusivement construit à partir d'un layout [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)" |
| [ ] | Voir le spectre du terrain des autres joueurs | |
| [ ] | S'identifier avec un nom | |
| [ ] | Permettre de voir toutes les salles disponibles | |
| [ ] | Créer une nouvelle salle | |
| [ ] | Pouvoir créer / rejoindre une salle à partir de l'URL directement | cf. ["hash uris"](https://www.w3.org/blog/2011/05/hash-uris/) <br/> http://\<server_name_or_ip>:\<port>/#\<room>[<player_name>]| 
| [ ] | Gérer la chute de pièce avec la barre espace  | |

# Server side
|     | To do | Comments |
| --- | ----- | -------- |
| [ ] | Créer une collection "rooms" | { _id, room_name, players_ids[], game_status, blocks_list[], settings{} |
| [ ] | Créer une collection "players" | { _id, name, blocks_consumed } |
| [ ] | Créer une collection "spectrums" | { _id, room_id, player_id } (Créer un index sur le roomId et un index sur le playerId) |
| [ ] | ? Mettre en place socket.io pour la communication entre serveur et client | voir si besoin |
| [ ] | [LIB] Créer une fonction qui génère X nouveaux tetriminos et les push à la suite de rooms.blocks_list | Le principe est d'éviter de faire trop d'appels entre clients et serveurs |
| [ ] | [GET] Créer un endpoint pour envoyer un nouveau stock de pièces (ex: 20 pièces) | Attention les joueurs doivent avoir les mêmes pièces. Le stock commun est rooms.blocks_list<br /><br />S'il y a assez de pièces, on retourne les nouvelles pièces. Sinon on en génère de nouvelles |
| [ ] | [POST] Sauvegarder le spectre d'un joueur |  |
| [ ] | [GET] Envoyer tous les spectres pour une room donnée |  |