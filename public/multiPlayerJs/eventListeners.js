// // const socket = io();

addEventListener('click', (event) => {
  // console.log("player event: ",players)
  
  for(const id in players)
  {
    if (socket.id===id)
    {
      // console.log("this player: ",players[id])
      const player=players[id];
      const angle = Math.atan2(
        // event.clientY - canvas.height / 2,
        // event.clientX - canvas.width / 2
        event.clientY-player.y,
        event.clientX-player.x
      )
      const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
      }
      console.log("velocity",velocity)
      const newProjectile = {
        idPlayer: player.id,
        x: player.x,
        y: player.y,
        vx: velocity.x,
        vy: velocity.y // negative velocity moves the projectile up
      };
      // console.log(newProjectile);
      // new Projectile(player.x, player.y, 5, 'white', velocity)
      socket.emit('fireProjectile', newProjectile);
    }
  }

  projectiles.push(
  )


})

addEventListener('keydown',(event)=>{
  console.log("click");
  if(event.key === 'ArrowUp'){
    // Move player up
    socket.emit('movement',{x:0,y:-10});
  }
  else if(event.key === 'ArrowDown'){
    // Move player down
    socket.emit('movement',{x:0,y:10});
  }
  else if(event.key === 'ArrowLeft'){
    //Move player left
    socket.emit('movement',{x:-10,y:10});
  }
  else if(event.key === 'ArrowRight'){
    //Move player right
    socket.emit('movement',{x:10,y:0});
  }
})

