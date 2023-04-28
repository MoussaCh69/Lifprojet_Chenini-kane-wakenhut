import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const tourMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    //VERTICAL
    if(initialPosition.x===desiredPosition.x){
        for(let i=1; i<8; i++){
            let multiplier = (desiredPosition.y<initialPosition.y) ? -1 : 1;
            let passedPosition = new Position(initialPosition.x, initialPosition.y+(i*multiplier));
            
            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team))
                    return true;
            }
            //DEPLACEMENT ILLEGAL
            else if(tileIsOccupied(passedPosition, boardState))
                break;
        }
    }
    //HORIZONTAL
    if(initialPosition.y===desiredPosition.y){
        for(let i=1; i<8; i++){
            let multiplier = (desiredPosition.x<initialPosition.x) ? -1 : 1;
            let passedPosition = new Position(initialPosition.x+(i*multiplier), initialPosition.y);

            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team))
                    return true;
            }
            //DEPLACEMENT ILLEGAL
            else if(tileIsOccupied(passedPosition, boardState))
                break;
        }
    }
    return false;
}

//OBTENIR MOUVEMENTS POSSIBLES
export const getPossibleTourMoves = (tour: Piece, boardState: Piece[]) : Position[] =>{
    const possibleMoves: Position[] = [];
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    //HAUT
    for(let i=1; i<8; i++){
        const destination = new Position(tour.position.x, tour.position.y+i);
        if(tour.position.y+i > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, tour.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS
    for(let i=1; i<8; i++){
        const destination = new Position(tour.position.x, tour.position.y-i);
        if(tour.position.y-i < 0)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, tour.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //GAUCHE
    for(let i=1; i<8; i++){
        const destination = new Position(tour.position.x-i, tour.position.y);
        if(tour.position.x-i < 0)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, tour.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //DROITE
    for(let i=1; i<8; i++){
        const destination = new Position(tour.position.x+i, tour.position.y);
        if(tour.position.x+i > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, tour.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}