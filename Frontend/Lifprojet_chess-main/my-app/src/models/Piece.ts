import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Piece{
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    hasMoved: boolean;
    possibleMoves?: Position[];

    constructor(position: Position, type: PieceType, team: TeamType, hasMoved: boolean, possibleMoves: Position[] = []){
        this.image = `${require(`../assets/images/${type}_${team}.png`)}`;
        this.position = position;
        this.type = type;
        this.team = team;
        this.hasMoved = hasMoved;
        this.possibleMoves = possibleMoves;
    }

    get isCavalier(): boolean{
        return this.type === PieceType.CAVALIER;
    }

    get isDame(): boolean{
        return this.type === PieceType.DAME;
    }

    get isFou(): boolean{
        return this.type === PieceType.FOU;
    }

    get isPion(): boolean{
        return this.type === PieceType.PION;
    }

    get isRoi(): boolean{
        return this.type === PieceType.ROI;
    }

    get isTour(): boolean{
        return this.type === PieceType.TOUR;
    }

    //CLONE LES PIECES ACTUELLES
    clone(): Piece{
        return new Piece(this.position.clone(), this.type, this.team, this.hasMoved, this.possibleMoves?.map(p => p.clone()));
    }

    //PIECE A LA MEME POSITION QU'UNE AUTRE PIECE
    samePiecePosition(otherPiece: Piece): boolean{
        return this.position.samePosition(otherPiece.position);
    }
    
    //PIECE A LA MEME POSITION QU'AUTRE CHOSE
    samePosition(otherPosition: Position): boolean{
        return this.position.samePosition(otherPosition);
    }
}