const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{pingInterval :2000,pingTimeout:5000});  //this is to frontend should ping the backend every 2sec and if the backend doesnot respond in 5 sec the player will be removed

const port = 5000;


app.use(express.static('public'))



// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html')
// })
// app.get('/singleplayer', (req, res) => {
//   res.sendFile(__dirname + '/public/singleplayer.html')
// })
// // app.get('/multiplayer', (req, res) => {
// //   res.sendFile(__dirname + '/public/multiplayer.html')
// // })

// const gameId = Math.floor(Math.random() * 9000) + 1000;
// console.log("gameId: " + gameId);
// app.get('/multiplayer/:gameId', (req, res) => {
//   // const gameId = req.params.gameId;
//   res.sendFile(__dirname + '/public/multiplayer.html');
// });

const gameId = Math.floor(Math.random() * 9000) + 1000;
console.log("gameId: " + gameId);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});
app.get('/multiplayer/room', (req, res) => {
  res.sendFile(__dirname + '/public/multiplayerRoom.html')
 
});

app.get('/singleplayer', (req, res) => {
  res.sendFile(__dirname + '/public/singleplayer.html')
});

// app.get('/multiplayer/:gameId', (req, res) => {
//   res.sendFile(__dirname + '/public/multiplayer.html');
// });

const players = {

};
let count=0;
// const projectiles={

// }


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', (roomId) => {
    console.log(`User joined room ${roomId}`);
    socket.join(roomId);
    app.get('/multiplayer/room/:roomId', (req, res) => {
    res.sendFile(__dirname + '/public/multiplayer.html');
  });
  io.emit('multiplayer',roomId);
  });
  // app.get('/check-room/:roomId', (req, res) => {
  //   const roomId = req.params.roomId;
    
  //   // Check if the room exists in the list of rooms
  //   const roomExists = io.sockets.adapter.rooms.has(roomId);
  
  //   // Send back a JSON response indicating whether the room exists or not
  //   res.json({ exists: roomExists });
  // });
  
});




io.on('connection', (socket) => {
  console.log('a user connected');
  players[socket.id] ={
    id:socket.id,
    x:500 *Math.random(),
    y:500 *Math.random(),
    score:0
  }
  io.emit('updatePlayers', players);  //if we just say socket.emmit the it emit to the current join player io.emit to all player in the connection

  socket.on('disconnect',(reason)=>{
    console.log("reason: ",reason);
    delete players[socket.id];
    io.emit('updatePlayers',players);//here we update the player array after a player is removed
  })
  socket.on('movement', (data) => {
    // Update player's position based on the movement data
    players[socket.id].x += data.x;
    players[socket.id].y += data.y;

    // Emit the updated player positions to all connected clients
    io.emit('updatePlayers', players);
  });
  socket.on('fireProjectile', (projectile) => {
    // Create a new projectile object and add it to the player's array of projectiles
    // player.projectiles.push(projectile);
    
    // console.log('Projectile',projectile);
    io.emit('fireProjectile',projectile);
  });
  socket.on('fireProjectilehit', (player) => {
    // Create a new projectile object and add it to the player's array of projectiles
    // player.projectiles.push(projectile);
    console.log("player jj",player.projectilePlayer);
    players[player.projectilePlayer].score+=1;
    console.log("player jj",players[player.projectilePlayer]);
    delete players[player.projectileHitPlayer];
    // console.log('player!!!!',player);
   // io.emit('fireProjectile',projectile);
    // io.emit('fireProjectile',projectile);
    io.emit('updatePlayers', players);
  });

  // console.log(players);
});
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
