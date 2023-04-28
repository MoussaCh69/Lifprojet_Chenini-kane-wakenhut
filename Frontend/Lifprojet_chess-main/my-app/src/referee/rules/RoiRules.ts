import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const roiMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    for(let i=1; i<2; i++){
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

//OBTENIR MOUVEMENTS POSSIBLES
export const getPossibleRoiMoves = (roi: Piece, boardState: Piece[]) : Position[] =>{
    const possibleMoves: Position[] = [];
    //LOGIQUE DEPLACEMENT ET ATTAQUE
    //HAUT
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x, roi.position.y+i);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x, roi.position.y-i);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //GAUCHE
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x-i, roi.position.y);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //DROITE
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x+i, roi.position.y);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //HAUT DROITE
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x+i, roi.position.y+i);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS DROITE
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x+i, roi.position.y-i);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //BAS GAUCHE
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x-i, roi.position.y-i);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    //HAUT GAUCHE
    for(let i=1; i<2; i++){
        const destination = new Position(roi.position.x-i, roi.position.y+i);
        if(destination.x < 0 || destination.x > 7 || destination.y < 0 || destination.y > 7)
            break;
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }
        else if(tileIsOccupiedByOpponent(destination, boardState, roi.team)){
            possibleMoves.push(destination);
            break;
        }
        else{
            break;
        }
    }
    return possibleMoves;
}

//DEPLACEMENT SPECIAL (ROQUE)
export const getCastlingMoves = (roi: Piece, boardState: Piece[]) : Position[] =>{
    const possibleMoves: Position[] = [];
    if(roi.hasMoved)
        return possibleMoves;
    
    //OBTENIR LES TOURS DE L'EQUIPE DU ROI QUI NE S'EST PAS DEPLACE
    const tours = boardState.filter(p => p.isTour && p.team === roi.team && !p.hasMoved);
    
    for(const tour of tours){
        //DETERMINE SI ON A BESOIN D'ALLER A GAUCHE OU A DROITE
        const direction = (tour.position.x-roi.position.x > 0) ? 1 : -1;
        
        const adjacentPosition = roi.position.clone();
        adjacentPosition.x += direction;
      
        if(!tour.possibleMoves?.some(p => p.samePosition(adjacentPosition)))
            continue;
        //=> ON SAIT MAINTENANT QUE LA TOUR PEUT SE DEPLACER SUR LE COTE ADJACENT DU ROI

        //OBTENIR SEULEMENT LES DEPLACEMENTS POSSIBLES DES TOURS SUR LE MEME AXE Y QUE LE ROI
        const concerningTiles = tour.possibleMoves.filter(p => p.y === roi.position.y);
        //VERIFIE SI l'UNE DES PIECES DE l'ADVERSAIRE PEUT ATTAQUER l'ESPACE ENTRE LA TOUR ET LE ROI
        const opponentPieces = boardState.filter(p => p.team !== roi.team);
        let valid = true;
        for(const opponent of opponentPieces){
            if(opponent.possibleMoves === undefined)
                continue;
            //VERIFIE SI L'UN DES DEPLACEMENTS POSSIBLES DE l'ADVERSAIRE EST PRESENT DANS LE TABLEAU CONCERNINGTILES
            for(const move of opponent.possibleMoves){
                if(concerningTiles.some(p => p.samePosition(move)))
                    valid = false;
                if(!valid)
                    break;
            }
            if(!valid)
                break;
        }
        if(!valid)
            continue;
        //AJOUT DANS LES DEPLACEMENTS POSSIBLES
        possibleMoves.push(tour.position.clone());
    }
    return possibleMoves;
}
