const socketIo = require('socket.io');
const rideController = require('./controllers/ride.controller');
let io;

function initializeSocket(server) {
    io = socketIo(server);

    io.on('connection', (socket) => {

        socket.on('fetchRides', async ({ filters }) => {
            const rides = await rideController.getAvailableRides(filters);
            socket.emit('rides', rides);
        });

        socket.on('fetchRidebyId', async ({id})=>{
            const details = await rideController.getRidebyId(id);
            if (details) {
                socket.emit('sendRideOfId', details);
            } else {
                socket.emit('sendRideOfId', null); // Emit null if no ride is found
            }
        })

        socket.on('disconnect', () => {
        });
    });
}

const getIoInstance = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// const sendMessageToSocketId = (socketId, messageObject) => {

// console.log(messageObject);

//     if (io) {
//         io.to(socketId).emit(messageObject.event, messageObject.data);
//     } else {
//         console.log('Socket.io not initialized.');
//     }
// }

module.exports = { initializeSocket, getIoInstance };