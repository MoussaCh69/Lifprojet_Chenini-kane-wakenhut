import { PieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Pion extends Piece{
    enPassant?: boolean;

    constructor(position: Position, team: TeamType, hasMoved: boolean, enPassant?: boolean, possibleMoves: Position[] = []){
        super(position, PieceType.PION, team, hasMoved, possibleMoves)
        this.enPassant = enPassant;
    }

    //CLONE LES PIONS
    clone(): Pion{
        return new Pion(this.position.clone(), this.team, this.hasMoved, this.enPassant, this.possibleMoves?.map(p => p.clone()));
    }
}