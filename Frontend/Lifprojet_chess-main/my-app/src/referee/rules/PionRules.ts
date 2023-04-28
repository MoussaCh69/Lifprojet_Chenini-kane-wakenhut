import { Piece } from "../../models/Piece";
import { Pion } from "../../models/Pion";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pionMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    const specialRow = (team === TeamType.NOUS) ? 1 : 6;
    const pionDirection = (team === TeamType.NOUS) ? 1 : -1;

    //LOGIQUE DEPLACEMENT NORMAUX
    //2 CASES
    if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y-initialPosition.y === 2*pionDirection){
        if(!tileIsOccupied(desiredPosition, boardState) && !tileIsOccupied(new Position(desiredPosition.x, desiredPosition.y-pionDirection), boardState))
            return true;
    }
    //1 CASE
    else if(initialPosition.x === desiredPosition.x && desiredPosition.y-initialPosition.y === pionDirection){
        if(!tileIsOccupied(desiredPosition, boardState))
            return true;
    }

    //LOGIQUE DEPLACEMENT ATTAQUE
    //ANGLE SUPERIEUR OU INFERIEUR GAUCHE
    else if(desiredPosition.x-initialPosition.x === -1 && desiredPosition.y-initialPosition.y === pionDirection){
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team))
            return true;
    }
    //ANGLE SUPERIEUR OU INFERIEUR DROIT
    else if(desiredPosition.x-initialPosition.x === 1 && desiredPosition.y-initialPosition.y === pionDirection){
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team))
            return true;
    }
    return false;
}

//OBTENIR MOUVEMENTS POSSIBLES
export const getPossiblePionMoves = (pion: Piece, boardState: Piece[]) : Position[] =>{
    const pionDirection = (pion.team === TeamType.NOUS) ? 1 : -1;
    const specialRow = (pion.team === TeamType.NOUS) ? 1 : 6;
    const possibleMoves : Position[] = [];
    const normalMove = new Position(pion.position.x, pion.position.y+pionDirection);
    const specialMove =  new Position(normalMove.x, normalMove.y+pionDirection);
    const upperLeftAttack = new Position(pion.position.x-1, pion.position.y+pionDirection);
    const upperRightAttack = new Position(pion.position.x+1, pion.position.y+pionDirection);
    const leftPosition = new Position(pion.position.x-1, pion.position.y);
    const rightPosition = new Position(pion.position.x+1, pion.position.y);
    
    //MOUVEMENTS NORMAUX
    //1 CASES
    if(!tileIsOccupied(normalMove, boardState)){
        possibleMoves.push(normalMove);
        //2 CASES
        if(pion.position.y === specialRow && !tileIsOccupied(specialMove, boardState))
            possibleMoves.push(specialMove);
    }

    //MOUVEMENTS ATTAQUE
    //ANGLE SUPERIEUR GAUCHE
    if(tileIsOccupiedByOpponent(upperLeftAttack, boardState, pion.team)){
        possibleMoves.push(upperLeftAttack);
    }
    //DEPLACEMENT SPECIAL (EN PASSANT)
    else if(!tileIsOccupied(upperLeftAttack, boardState)){
        const leftPiece = boardState.find(p => p.samePosition(leftPosition));
        if(leftPiece != null && (leftPiece as Pion).enPassant)
            possibleMoves.push(upperLeftAttack);
    }
    
    //ANGLE SUPERIEUR DROIT
    if(tileIsOccupiedByOpponent(upperRightAttack, boardState, pion.team)){
        possibleMoves.push(upperRightAttack);
    }
    //DEPLACEMENT SPECIAL (EN PASSANT)
    else if(!tileIsOccupied(upperRightAttack, boardState)){
        const rightPiece = boardState.find(p => p.samePosition(rightPosition));
        if(rightPiece != null && (rightPiece as Pion).enPassant)
            possibleMoves.push(upperRightAttack);
    }
    return possibleMoves;
}