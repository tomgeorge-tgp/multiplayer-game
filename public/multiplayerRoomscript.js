const createRoomBtn = document.querySelector('#create-room-btn');
const joinRoomBtn = document.querySelector('#join-room-btn');
const roomIdInputContainer = document.querySelector('#room-id-input-container');
const roomIdInput = document.querySelector('#room-id-input');
const joinBtn = document.querySelector('#join-btn');

let socket = null;
let roomId = null;

// Create room
createRoomBtn.addEventListener('click', () => {
      socket = io(); // Initialize socket connection
     console.log("here");
    // Generate random room ID
    roomId = Math.floor(Math.random() * 9000) + 1000;

    // Join the room
    socket.emit('join-room', roomId);
    socket.on('multiplayer', (currentRoomID) => {
    console.log('joining', currentRoomID);
    // Redirect to game page
    window.location.href = `/multiplayer/room/${currentRoomID}`;
    });
});

// Join room
// joinRoomBtn.addEventListener('click', () => {
//     roomIdInputContainer.classList.remove('hidden');
// });

joinBtn.addEventListener('click', () => {
    roomId = roomIdInput.value;
 console.log('Room Id',roomId);
    // Check if room exists
    fetch(`/multiplayer/room/${roomId}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                // Join the room
                socket = io(); // Initialize socket connection
                socket.emit('join-room', roomId);

                // Redirect to game page
                window.location.href = `/multiplayer/room/${roomId}`;
            } else {
                alert('Room does not exist');
            }
        });
});
