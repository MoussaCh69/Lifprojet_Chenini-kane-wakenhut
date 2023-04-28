import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import { HORIZONTAL_AXIS, VERTICAL_AXIS, GRID_SIZE } from '../../Constants';
import { Piece } from '../../models/Piece';
import { Position } from '../../models/Position';

//PROPRIETES ATTENDUS DU COMPOSANT CHESSBOARD
//PROPRIETES(PROPS) = OBJETS CONTENANT DES DONNEES PASSEES EN PARAMETRES AU COMPOSANT CHESSBOARD
interface Props{
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

export default function Chessboard({playMove, pieces} : Props){
    //USEREF = CREE UNE REFERENCE PERSISTANT PENDANT TOUTE LA DUREE DE VIE DU COMPOSANT CHESSBOARD
    //CETTE REFERENCE PEUT PERMETTRE DE STOCKER DES VALEURS OU DES REFERENCES A DES ELEMENTS DOM POUVANT ETRE MODIFIEES AU COURS DU TEMPS
    //ET PERMET DE NE PAS PERDRE LA VALEUR D'UNE VARIABLE LOCALE APRES LES RENDUS DU COMPOSANT CHESSBOARD
    //MAIS AUSSI DE NE PAS DECLENCHER UN NOUVEAU RENDU DU COMPOSANT CHESSBOARD A CHAQUE MODIFICATION DE LA REFERENCE
    const chessboardRef = useRef<HTMLDivElement>(null);
    //USESTATE = PERMET DE DECLARER UNE VARIABLE D'ETAT LOCALE AU COMPOSANT CHESSBOARD
    //CETTE VARIABLE D'ETAT PEUT PERMETTRE DE STOCKER DES VALEURS POUVANT ETRE MODIFIEES AU COURS DU TEMPS
    //ET PERMET DE NE PAS PERDRE LA VALEUR DE LA VARIABLE D'ETAT APRES LES RENDUS DU COMPOSANT CHESSBOARD
    //MAIS AUSSI DE DECLENCHER UN NOUVEAU RENDU DU COMPOSANT CHESSBOARD A CHAQUE MODIFICATION DE LA VARIABLE D'ETAT
    const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);

    //ATTRAPER UNE PIECE
    function grabPiece(e: React.MouseEvent){
        //CLIC SOURIS 
        const element = e.target as HTMLElement;
        //ECHIQUIER ACTUEL
        const chessboard = chessboardRef.current;
        //SI C'EST UNE PIECE SUR L'ECHIQUIER
        if(element.classList.contains("chess-piece") && chessboard){
            //NOUVELLE POSITION DE LA PIECE QUE L'ON A ATTRAPE, SI ON RELACHE LE CLIC SOURIS ELLE REVIENT A SA POSITION INITIALE
            const grabX = Math.floor((e.clientX-chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-800) / GRID_SIZE));
            setGrabPosition(new Position(grabX, grabY));
            //MODIFICATIONS DE LA POSITION DE LA PIECE APRES AVOIR FAIT UN CLIC SOURIS DESSUS
            const x = e.clientX - GRID_SIZE/2;
            const y = e.clientY - GRID_SIZE/2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            //LA PIECE SUIT NOTRE CURSEUR
            setActivePiece(element);
        }
    }

    //DEPLACER UNE PIECE
    function movePiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        //SI C'EST UNE PIECE ATTRAPEE SUR L'ECHIQUIER
        if(activePiece && chessboard){
            //LIMITES DE DEPLACEMENT D'UNE PIECE SUR L'ECHIQUIER
            const minX = chessboard.offsetLeft-20;
            const minY = chessboard.offsetTop-20;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth-80;
            const maxY = chessboard.offsetTop + chessboard.clientHeight-80;
            //MODIFICATIONS DE LA POSITION DE LA PIECE ATTRAPEE A CHAQUE MOUVEMENT DE CELLE-CI
            const x = e.clientX-50;
            const y = e.clientY-50;
            activePiece.style.position = "absolute";
            if(x<minX)
                activePiece.style.left = `${minX}px`;
            else if(x>maxX)
                activePiece.style.left = `${maxX}px`;
            else
                activePiece.style.left = `${x}px`;

            if(y<minY)
                activePiece.style.top = `${minY}px`;
            else if(y>maxY)
                activePiece.style.top = `${maxY}px`;
            else
                activePiece.style.top = `${y}px`;
        }
    }

    //DEPOSER UNE PIECE SUR UN NOUVEAU CARREAU
    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const x = Math.floor((e.clientX - chessboard.offsetLeft)/GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop-800)/GRID_SIZE));
            //PIECE COURANTE = PIECE A LA MEME POSITION QUE LA PIECE ACTUELLEMENT ATTRAPEE
            const currentPiece = pieces.find(p => p.samePosition(grabPosition));
            
            if(currentPiece){
                //DEPOSE LA PIECE COURANTE SUR LE NOUVEAU CARREAU OU ELLE EST POSITIONNEE => SUCCESS TRUE
                var success = playMove(currentPiece.clone(), new Position(x, y));
                //SI SUCCESS FALSE => REINITIALISE LA POSITION DE LA PIECE ATTRAPEE
                if(!success){
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
            //PLUS AUCUNE PIECE ATTRAPEE
            setActivePiece(null);
        }
    }

    //TABLEAU DE L'ECHIQUIER VIDE
    let board = [];
    //PARCOURT TOUS LES CARREAUX DE L'ECHIQUIER
    for(let j=VERTICAL_AXIS.length-1; j>=0; j--){
        for(let i=0; i<HORIZONTAL_AXIS.length; i++){
            //NUMERO DE CARREAU
            const number = j+i+2;
            //PIECE A LA MEME POSITION QUE LA POSITION DONNEE DANS LE FICHIER CONSTANTS
            const piece = pieces.find(p => p.samePosition(new Position(i, j)));
            //SI C'EST UNE PIECE, LUI METTRE l'IMAGE DE LA PIECE DONNEE DANS LE FICHIER CONSTANTS
            let image = piece ? piece.image : undefined;
            //SI PIECE ATTRAPEE, PIECE COURANTE = PIECE A LA MEME POSITION QUE LA PIECE ACTUELLEMENT ATTRAPEE
            let currentPiece = (activePiece != null) ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
            //SI DEPLACEMENTS POSSIBLES DE LA PIECE COURANTE, AFFICHE TOUS LES DEPLACEMENTS POSSIBLES SUR LES CARREAUX
            let highlight = (currentPiece?.possibleMoves) ? currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;
            
            //AJOUTE TOUS LES CARREAUX AVEC LEURS PROPRIETES DANS LE TABLEAU DE L'ECHIQUIER
            board.push(
                <Tile key={`${j},${i}`} 
                image={image} 
                number={number}
                highlight={highlight}/>
            );
        }
    }
    //FONCTION APPELEE SELON L'ACTION EFFECTUEE AVEC SA SOURIS SUR L'ECHIQUIER
    return(
        <div>
            <div onMouseMove={e => movePiece(e)} 
            onMouseDown={e => grabPiece(e)}
            onMouseUp={e => dropPiece(e)}
            id="chessboard"
            ref={chessboardRef}>
                {board}
            </div>
        </div>
    );
}