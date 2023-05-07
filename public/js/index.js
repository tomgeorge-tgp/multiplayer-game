const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const socket = io();
const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

//let player = new Player(x, y, 10, 'white')
const players={}
const enemies = []
const particles = []
const projectiles = []

socket.on('updatePlayers', (backendPlayers)=>{
  for(const id in backendPlayers)
  {
    const backendPlayer = backendPlayers[id]
    
    if(!players[id])
    {
      players[id]=new Player(backendPlayer.id,backendPlayer.x,backendPlayer.y,backendPlayer.score,10,'white')
    }
    else if(players[id].x != backendPlayer.x || players[id].y != backendPlayer.y)
    {
      players[id].x = backendPlayer.x;
      players[id].y = backendPlayer.y;
    }
    
  }
  //after deleting a player in backend to make the frontendand backend players match 
  for(const id in players)
  {
    if (!backendPlayers[id])
    {
      delete players[id];
    }
  }
  console.log("players",players);
})

socket.on('fireProjectile', (projectile) => {
  // Create a new projectile object and add it to the player's array of projectiles
 const idPlayer=projectile.idPlayer;
 console.log("idplayer",idPlayer);
  velocity={
    x: projectile.vx,
    y: projectile.vy
  }
  projectiles.push(
    new Projectile(projectile.x,projectile.y,idPlayer, 5, 'white', velocity)
  )
});
 // projectiles.push(
  //   new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
  // )

let animationId

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  
  for(const id in players) {
    const player = players[id]
    player.draw();
  }
  
  const playerList = document.getElementById("player-list");

  playerList.innerHTML = "";
  for (const id in players) {
    const playerdata = players[id];
    // create a list item with the player name and score
    const listItem = document.createElement("li");
    listItem.innerHTML = `${playerdata.id}: <span id="score${id}">${playerdata.score}</span>`;
    // add the list item to the player list
    playerList.appendChild(listItem);
  }
   








   for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index]

    projectile.update()

    // remove from edges of screen
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1)
    }
  }


  // to remove the player when projectile hits

  for ( let projectilesIndex=projectiles.length-1;projectilesIndex>=0;projectilesIndex--) {
  // console.log("here");

  const projectile = projectiles[projectilesIndex];
  //  console.log("projectile",projectile);
  // console.log("player",player);
  for(const id in players) {
    const removePlayer = players[id]
    const dist = Math.hypot(projectile.x - removePlayer.x, projectile.y - removePlayer.y);
    //console.log("dist",dist- projectile.radius - removePlayer.radius);
    if (dist - projectile.radius - removePlayer.radius < 1) {
      if(removePlayer.id!=projectile.idPlayer){
        // console.log("player id",removePlayer.id);
        // console.log("project player id",projectile.idPlayer);
        // console.log("hit hit hit");
        const idData={
          projectilePlayer:projectile.idPlayer,
          projectileHitPlayer:id,
        }
        projectiles.splice(projectilesIndex, 1)
        socket.emit('fireProjectilehit', idData);
        }
      }
    
  }
}






  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index]

    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    //end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
    }

    for (
      let projectilesIndex = projectiles.length - 1;
      projectilesIndex >= 0;
      projectilesIndex--
    ) {
      const projectile = projectiles[projectilesIndex]

      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      // when projectiles touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        // create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6)
              }
            )
          )
        }
        // this is where we shrink our enemy
        if (enemy.radius - 10 > 5) {
          score += 100
          scoreEl.innerHTML = score
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          projectiles.splice(projectilesIndex, 1)
        } else {
          // remove enemy if they are too small
          score += 150
          scoreEl.innerHTML = score

          enemies.splice(index, 1)
          projectiles.splice(projectilesIndex, 1)
        }
      }
    }
  }


}
animate();

