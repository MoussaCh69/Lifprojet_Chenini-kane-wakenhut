import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const fouMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    for(let i=1; i<8; i++){
        //HAUT DROITE
        if(desiredPosition.x>initialPosition.x && desiredPosition.y>initialPosition.y){
            let passedPosition = new Position(initialPosition.x+i, initialPosition.y+i);
            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team))
                    return true;
            }
            //DEPLACEMENT ILLEGAL
            else if(tileIsOccupied(passedPosition, boardState))
                break;
        }
        //BAS DROITE
        if(desiredPosition.x>initialPosition.x && desiredPosition.y<initialPosition.y){
            let passedPosition = new Position(initialPosition.x+i, initialPosition.y-i);
            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team))
                    return true;
            }
            //DEPLACEMENT ILLEGAL
            else if(tileIsOccupied(passedPosition, boardState))
                break;
        }
        //BAS GAUCHE
        if(desiredPosition.x<initialPosition.x && desiredPosition.y<initialPosition.y){
            let passedPosition = new Position(initialPosition.x-i, initialPosition.y-i);
            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team))
                    return true;
            }
            //DEPLACEMENT ILLEGAL
            else if(tileIsOccupied(passedPosition, boardState))
                break;
        }
        //HAUT GAUCHE
        if(desiredPosition.x<initialPosition.x && desiredPosition.y>initialPosition.y){
            let passedPosition = new Position(initialPosition.x-i, initialPosition.y+i);
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
export const getPossibleFouMoves = (fou: Piece, boardState: Piece[]) : Position[] =>{
    const possibleMoves: Position[] = [];
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    //HAUT DROITE
    for(let i=1; i<8; i++){
        const destination = new Position(fou.position.x+i, fou.position.y+i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, fou.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS DROITE
    for(let i=1; i<8; i++){
        const destination = new Position(fou.position.x+i, fou.position.y-i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, fou.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS GAUCHE
    for(let i=1; i<8; i++){
        const destination = new Position(fou.position.x-i, fou.position.y-i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, fou.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //HAUT GAUCHE
    for(let i=1; i<8; i++){
        const destination = new Position(fou.position.x-i, fou.position.y+i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, fou.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}