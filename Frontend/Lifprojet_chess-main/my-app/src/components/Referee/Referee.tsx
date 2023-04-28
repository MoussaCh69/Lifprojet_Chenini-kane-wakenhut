import { useRef, useState, useContext, useEffect } from "react";
import tour_blanc from '../../assets/images/tour_blanc.png';
import fou_blanc from '../../assets/images/fou_blanc.png';
import cavalier_blanc from '../../assets/images/cavalier_blanc.png';
import dame_blanc from '../../assets/images/dame_blanc.png';
import AuthContext from "../../context/AuthProvider";
 /*import roi_blanc from '../../assets/images/roi_blanc.png';
import pion_blanc from '../../assets/images/pion_blanc.png';
import tour_noir from '../../assets/images/tour_noir.png';
import fou_noir from '../../assets/images/fou_noir.png';
import dame_noir from '../../assets/images/dame_noir.png';
import roi_noir from '../../assets/images/roi_noir.png';
import pion_noir from '../../assets/images/pion_noir.png';*/  

import { initialBoard } from "../../Constants";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/Chessboard";
import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { Pion } from "../../models/Pion";
import { Board } from "../../models/Board";
import SocketContext from "../../context/SocketContext";
interface RefereeProps {
    roomId?: string;
}

export default function Referee({ roomId }: RefereeProps) {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPion, setPromotionPion] = useState<Piece>();
    const promotionRef = useRef<HTMLDivElement>(null);
    //const buttonSkipTurnsRef = useRef<HTMLButtonElement>(null);
    const checkmateRef = useRef<HTMLDivElement>(null);
    const socket = useContext(SocketContext);
    const auth = useContext(AuthContext);
    const [localPlayerTeam, setLocalPlayerTeam] = useState<TeamType | null>(null);

    const player1Team = auth?.auth?.username === "HostPlayer" ? TeamType.NOUS : TeamType.ADVERSAIRE;
    const player2Team = auth?.auth?.username === "JoiningPlayer" ? TeamType.ADVERSAIRE : TeamType.NOUS;

    function playMove(playedPiece: Piece, destination: Position): boolean {
        //EMPECHE UNE EQUIPE DE JOUER 2 FOIS DE SUITE A L'AIDE DU TOUR
        if ((playedPiece.team === TeamType.NOUS && board.totalTurns % 2 !== 1) || (playedPiece.team === TeamType.ADVERSAIRE && board.totalTurns % 2 !== 0))
            return false;

        //DEPLACEMENTS POSSIBLES
        if (playedPiece.possibleMoves === undefined)
            return false;
        const validMove = playedPiece.possibleMoves.some(p => p.samePosition(destination));
        if (!validMove)
            return false;
        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        let playedMoveIsValid = false;

        //PLAYMOVE MODIFIE L'ECHIQUIER DONC ON DOIT APPELER SETBOARD
        setBoard(() => {
            const clonedBoard = board.clone();
            //INCREMENTE LE COMPTEUR DE TOUR
            clonedBoard.totalTurns += 1;
            //JOUER LE DEPLACEMENT
            playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);
            //SI UNE EQUIPE EST GAGNANTE => RETIRE LA CLASSE "HIDDEN" A LA DIV REF="CHECKMATEREF" AFIN DE LA VOIR
            if (clonedBoard.winningTeam !== undefined)
                checkmateRef.current?.classList.remove("hidden");
            return clonedBoard;
        });
        socket?.on("assignTeam", (team: TeamType) => {
            setLocalPlayerTeam(team);
          });
        // Check if the move is played by the local player before emitting the move
        if (playedMoveIsValid && localPlayerTeam && playedPiece.team === localPlayerTeam) {
            socket?.emit("move", { roomId, from: playedPiece.position, to: destination });
        }
        socket?.emit("joinRoom", { roomId, role: auth?.auth?.username });

        //PROMOTION DU PION
        //LIGNE DE PROMOTION = LIGNE 7 SI NOUS / LIGNE 0 SI ADVERSAIRE
        let promotionRow = (playedPiece.team === TeamType.NOUS) ? 7 : 0;
        //SI LA DESTINATION DE LA PIECE SUR L'AXE Y EST LA MEME QUE LA LIGNE DE PROMOTION
        //ET QUE LA PIECE EN TRAIN D'ETRE JOUEE EST UN PION
        if (destination.y === promotionRow && playedPiece.isPion) {
            //RETIRE LA CLASSE "HIDDEN" A LA DIV REF="PROMOTIONREF" AFIN DE LA VOIR
            promotionRef.current?.classList.remove("hidden");
            setPromotionPion(() => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }
        return playedMoveIsValid;
    }
    useEffect(() => {
        if (socket) {
            socket.on("move", (move) => {
                // Handle received moves here
                const { from, to } = move;
                const piece = board.getPieceAtPosition(from);

                if (piece) {
                    const success = playMove(piece, to);
                    if (success) {
                        // Move was successful, update the board
                        setBoard((prevBoard) => prevBoard.clone());
                    }
                }
            });
            socket.on("assignTeam", (team) => {
                setLocalPlayerTeam(team);
            });


            // Join the room
            socket.emit("joinRoom", roomId);

            return () => {
                // Clean up the listeners when the component is unmounted
                socket.off("move");
                socket.off("assignTeam");
            };
        }
    }, [socket, roomId, board]);

    //DEPLACEMENT SPECIAL (EN PASSANT)
    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        //DIRECTION DU PION = 1 SI NOUS / -1 SI ADVERSAIRE
        const pionDirection = (team === TeamType.NOUS) ? 1 : -1;
        if (type === PieceType.PION) {
            //SI SUR L'AXE X LA POSITION DESIREE SOUSTRAIT PAR LA POSITION INITIALE EST EGALE A -1 OU 1
            //ET SI SUR L'AXE Y LA POSITION DESIREE SOUSTRAIT PAR LA POSITION INITIALE EST EGALE A LA DIRECTION DU PION
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && (desiredPosition.y - initialPosition.y === pionDirection)) {
                //PIECE = PION AVEC ENPASSANT=TRUE ET A LA MEME POSITION QUE CELLE DESIREE SUR L'AXE X
                //ET SUR L'AXE Y LA POSITION EST EGALE A LA POSITION DESIREE SOUSTRAIT PAR LA DIRECTION DU PION
                const piece = board.pieces.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pionDirection && p.isPion && (p as Pion).enPassant);
                if (piece)
                    return true;
            }
        }
        return false;
    }

    //PROMOTION DU PION
    function promotePion(pieceType: PieceType) {
        if (promotionPion === undefined)
            return;
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                //SI LA PIECE EST A LA MEME POSITION QUE LE PION PROMU
                if (piece.samePiecePosition(promotionPion))
                    //CHANGEMENT DU PION EN UNE AUTRE PIECE
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
                else
                    //LA PIECE RESTE LA MEME
                    results.push(piece);
                return results;
            }, [] as Piece[]);
            //CALCULE LES DEPLACEMENTS POSSIBLES DE TOUTES LES PIECES SUR L'ECHIQUIER CLONE POUR QUE LE PION PROMU
            //EN UNE AUTRE PIECE AIT BIEN LES DEPLACEMENTS POSSIBLES DE L'AUTRE PIECE ET NON D'UN PION
            clonedBoard.calculateAllMoves();
            return clonedBoard;
        });
        //AJOUTE LA CLASSE "HIDDEN" A LA DIV REF="PROMOTIONREF" AFIN DE NE PAS LA VOIR
        promotionRef.current?.classList.add("hidden");
    }

    //RELANCER LE JEU
    function restartGame() {
        checkmateRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    //PASSER DES TOURS
    /*function skipTurns(){
        board.totalTurns += 20;
        setBoard(() =>{
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results) => {
                //SUPPRIME TOUTES LES PIECES DE l'ECHIQUIER PUIS PLACE QUELQUES PIECES
                results.push();
                results.push(new Piece(`${roi_noir}`, new Position(6, 7), PieceType.ROI, TeamType.ADVERSAIRE, false),
                    new Piece(`${tour_noir}`, new Position(3, 7), PieceType.TOUR, TeamType.ADVERSAIRE, false),
                    new Piece(`${dame_noir}`, new Position(3, 6), PieceType.DAME, TeamType.ADVERSAIRE, false),
                    new Piece(`${fou_noir}`, new Position(3, 5), PieceType.FOU, TeamType.ADVERSAIRE, false),
                    new Piece(`${pion_noir}`, new Position(1, 5), PieceType.PION, TeamType.ADVERSAIRE, false),
                    new Piece(`${pion_noir}`, new Position(2, 6), PieceType.PION, TeamType.ADVERSAIRE, false),
                    new Piece(`${pion_noir}`, new Position(5, 6), PieceType.PION, TeamType.ADVERSAIRE, false),
                    new Piece(`${pion_noir}`, new Position(6, 6), PieceType.PION, TeamType.ADVERSAIRE, false),
                    new Piece(`${pion_noir}`, new Position(7, 6), PieceType.PION, TeamType.ADVERSAIRE, false),
                    new Piece(`${dame_blanc}`, new Position(6, 4), PieceType.DAME, TeamType.NOUS, false),
                    new Piece(`${cavalier_blanc}`, new Position(5, 4), PieceType.CAVALIER, TeamType.NOUS, false),
                    new Piece(`${roi_blanc}`, new Position(6, 0), PieceType.ROI, TeamType.NOUS, false),
                    new Piece(`${tour_blanc}`, new Position(4, 0), PieceType.TOUR, TeamType.NOUS, false),
                    new Piece(`${pion_blanc}`, new Position(5, 1), PieceType.PION, TeamType.NOUS, false),
                    new Piece(`${pion_blanc}`, new Position(6, 1), PieceType.PION, TeamType.NOUS, false),
                    new Piece(`${pion_blanc}`, new Position(2, 2), PieceType.PION, TeamType.NOUS, false),
                    new Piece(`${pion_blanc}`, new Position(3, 3), PieceType.PION, TeamType.NOUS, false)
                );
                return results;
            }, [] as Piece[]);
            clonedBoard.calculateAllMoves();
            return clonedBoard;
        });
        //DESACTIVE LE BOUTON APRES L'AVOIR UTILISE
        if(buttonSkipTurnsRef.current)
            buttonSkipTurnsRef.current.setAttribute('disabled', "true");
    }*/



    //AFFICHAGE DU COMPTEUR DE TOUR, DU BOUTON PASSER DES TOURS, DU CHOIX DE LA PIECE POUR LA PROMOTION DU PION, DE L'ECHIQUIER AVEC LES PIECES ET DE L'ECHEC ET MAT
    return (
        <div>
            <p className="upperRow">TOUR {board.totalTurns}
                {/* <button ref={buttonSkipTurnsRef} onClick={skipTurns}>PASSER DES TOURS</button> */}
            </p>

            <div className="ref hidden" ref={promotionRef}>
                <div className="body">
                    <img onClick={() => promotePion(PieceType.TOUR)} src={`${tour_blanc}`} alt="tour" />
                    <img onClick={() => promotePion(PieceType.FOU)} src={`${fou_blanc}`} alt="fou" />
                    <img onClick={() => promotePion(PieceType.CAVALIER)} src={`${cavalier_blanc}`} alt="cavalier" />
                    <img onClick={() => promotePion(PieceType.DAME)} src={`${dame_blanc}`} alt="dame" />
                </div>
            </div>

            <div className="ref hidden" ref={checkmateRef}>
                <div className="body">
                    <div className="checkmate">
                        <span>L'équipe {(board.winningTeam === TeamType.NOUS) ? "blanche" : "noire"} a gagné !</span>
                        <button onClick={restartGame}>Rejouer</button>
                    </div>
                </div>
            </div>

            <Chessboard playMove={playMove} pieces={board.pieces} />
        </div>
    );
}