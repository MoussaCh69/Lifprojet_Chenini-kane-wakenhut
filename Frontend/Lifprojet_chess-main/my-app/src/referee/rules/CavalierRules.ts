import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const cavalierMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    for(let i=-1; i<2; i+=2){
        for(let j=-1; j<2; j+=2){
            //2 HAUT OU BAS ET 1 DROITE OU GAUCHE
            if(desiredPosition.y-initialPosition.y === 2*i){
                if(desiredPosition.x-initialPosition.x === j){
                    if(tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team))
                        return true;
                }
            }
            //1 HAUT OU BAS ET 2 DROITE OU GAUCHE
            if(desiredPosition.x-initialPosition.x === 2*i){
                if(desiredPosition.y-initialPosition.y === j){
                    if(tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team))
                        return true;
                }
            }
        }
    }
    return false;
}

//OBTENIR DEPLACEMENTS POSSIBLES
export const getPossibleCavalierMoves = (cavalier: Piece, boardState: Piece[]) : Position[] =>{
    const possibleMoves: Position[] = [];
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    for(let i=-1; i<2; i+=2){
        for(let j=-1; j<2; j+=2){
            const verticalMove = new Position(cavalier.position.x+j, cavalier.position.y+i*2);
            const horizontalMove = new Position(cavalier.position.x+i*2, cavalier.position.y+j);
        
            //2 HAUT OU BAS ET 1 DROITE OU GAUCHE
            if(tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, cavalier.team))
                possibleMoves.push(verticalMove);
            //1 HAUT OU BAS ET 2 DROITE OU GAUCHE
            if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, cavalier.team))
                possibleMoves.push(horizontalMove);
        }
    }
    return possibleMoves;
}
