import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const dameMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    for(let i=1; i<8; i++){
        let multiplierX = (desiredPosition.x<initialPosition.x) ? -1 : (desiredPosition.x>initialPosition.x) ? 1 : 0;
        let multiplierY = (desiredPosition.y<initialPosition.y) ? -1 : (desiredPosition.y>initialPosition.y) ? 1 : 0;
        let passedPosition = new Position(initialPosition.x+(i*multiplierX), initialPosition.y+(i*multiplierY));
        
        if(passedPosition.samePosition(desiredPosition)){
            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team))
                return true;
        }
        //DEPLACEMENT ILLEGAL
        else if(tileIsOccupied(passedPosition, boardState))
            break;
    }
    return false;
}

//OBTENIR DEPLACEMENTS POSSIBLES
export const getPossibleDameMoves = (dame: Piece, boardState: Piece[]) : Position[] =>{
    const possibleMoves: Position[] = [];
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    //HAUT
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x, dame.position.y+i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x, dame.position.y-i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //GAUCHE
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x-i, dame.position.y);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //DROITE
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x+i, dame.position.y);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //HAUT DROITE
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x+i, dame.position.y+i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS DROITE
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x+i, dame.position.y-i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS GAUCHE
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x-i, dame.position.y-i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //HAUT GAUCHE
    for(let i=1; i<8; i++){
        const destination = new Position(dame.position.x-i, dame.position.y+i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, dame.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}