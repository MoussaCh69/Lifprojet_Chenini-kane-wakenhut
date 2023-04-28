export class Position{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    //CLONE LES POSITIONS DES PIECES ACTUELLES
    clone(): Position{
        return new Position(this.x, this.y);
    }

    //MEME POSITION QU'UNE AUTRE POSITION
    samePosition(otherPosition: Position): boolean{
        return this.x === otherPosition.x && this.y === otherPosition.y;
    }
    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }
}
