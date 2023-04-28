import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import { TeamType } from "../../Types";

export const tileIsEmptyOrOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType) =>{
    return !tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team);
}

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean =>{
    const piece = boardState.find(p => p.samePosition(position));
    if(piece)
        return true;
    else
        return false;
}

export const tileIsOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType): boolean =>{
    const piece = boardState.find(p => p.samePosition(position) && p.team !== team);
    if(piece)
        return true;
    else
        return false;
}