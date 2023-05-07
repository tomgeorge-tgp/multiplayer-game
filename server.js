const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{pingInterval :2000,pingTimeout:5000});  //this is to frontend should ping the backend every 2sec and if the backend doesnot respond in 5 sec the player will be removed

const port = 5000;


app.use(express.static('public'))



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/landingPage.html')
})

const players = {

};
let count=0;
// const projectiles={

// }

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
    console.log(player);
    players[player.projectilePlayer].score+=1;

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
