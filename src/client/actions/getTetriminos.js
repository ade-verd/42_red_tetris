export const getTetriminos = (roomId, piecePosition, piecesNumber) => {
  return {
    room_id: roomId,
    pieces_position: piecePosition,
    number: piecesNumber,
  };
}

