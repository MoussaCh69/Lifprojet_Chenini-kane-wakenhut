import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Referee from './Referee/Referee';

const Game = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    }
  }, [socket, roomId]);

  return <Referee />;
};

export default Game;