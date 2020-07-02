export const getRoom = (rooms, roomId) => {
    if (!rooms) return;

    console.log('ONUR', rooms);

    let currentRoom;
    rooms.some(room => {
        if (room._id === roomId) {
            currentRoom = room;
            return true;
        }
    });

    return currentRoom;
};
