import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import SocketContext from "../context/SocketContext";
import Referee from "../components/Referee/Referee";

export default function JoinGame() {
  const { auth, setAuth } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { roomId } = useParams();
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && typeof socket === "object") {
      socket.on("startGame", () => {
        console.log("Game started");
        navigate(`/join/${roomId}`);
      });

      return () => {
        // Clean up the listeners when the component is unmounted
        socket.off("startGame");
      };
    }
  }, [socket, roomId, navigate]);

  function handleJoinGame() {
    if (auth) {
      socket?.emit("joinRoom", { roomId, role: auth?.username });
      setJoined(true);
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="join-game-page">
      {auth ? (
        <h1>Bienvenue {auth.username} à Chess King</h1>
      ) : (
        <h1>Bienvenue à Chess King</h1>
      )}
      {joined ? (
        <div>
          <h2>Vous avez rejoint le jeu avec succès.</h2>
          <Referee roomId={roomId ?? ""} />
        </div>
      ) : (
        <div>
          <button onClick={handleJoinGame}>Rejoindre le jeu</button>
        </div>
      )}
    </div>
  );
}
