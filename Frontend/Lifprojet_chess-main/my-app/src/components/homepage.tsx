import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Referee from "../components/Referee/Referee";
import AuthContext from "../context/AuthProvider";
import { v4 as uuidv4 } from "uuid";

interface Game {
  // Define the properties of a game here
}

export default function GamePage() {
  const { auth } = useContext(AuthContext);
  console.log("Auth object:", auth);
  const [game, setGame] = useState<Game | null>(null);
  const [joinGameURL, setJoinGameURL] = useState<string>("");
  const navigate = useNavigate();

  function handleNewGame() {
    const gameId = uuidv4();
    setGame({});
  
    if (auth) {
      auth.roomId = gameId;
      setJoinGameURL(`${window.location.origin}/join/${gameId}`);
      navigate(`/referee/${gameId}`);
    }
  }

  function handleJoinGame() {
    const roomId = joinGameURL.split("/").pop();
    if (roomId) {
      navigate(`/join/${roomId}`);
    }
  }

  return (
    <div className="page">
      {auth ? (
        <h1>
          Bienvenue {auth.username}  à Chess King 
        </h1>
      ) : (
        <h1>Bienvenue à Chess King</h1>
      )}
      {auth && (
        <p>
          Partagez ce lien pour inviter d'autres personnes dans votre salle :{" "}
          <span>{window.location.origin}/referee/{auth.roomId}</span>
        </p>
      )}
      <div>
        <input
          type="text"
          value={joinGameURL}
          onChange={(e) => setJoinGameURL(e.target.value)}
          placeholder="Entrez l'URL pour rejoindre un jeu"
        />
        <button onClick={handleJoinGame}>Rejoindre le jeu</button>
      </div>
      {game ? (
        // Render the game UI here
        <div>
          <h2>Jeu actuel</h2>
          <Referee roomId={auth?.roomId ?? ""} />
        </div>
      ) : (
        <div>
          <button onClick={handleNewGame}>Nouveau jeu</button>
        </div>
      )}
    </div>
  );
}
