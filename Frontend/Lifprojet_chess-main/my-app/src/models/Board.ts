import { getPossibleCavalierMoves } from "../referee/rules/CavalierRules";
import { getPossibleDameMoves } from "../referee/rules/DameRules";
import { getPossibleFouMoves } from "../referee/rules/FouRules";
import { getPossiblePionMoves } from "../referee/rules/PionRules";
import { getCastlingMoves, getPossibleRoiMoves } from "../referee/rules/RoiRules";
import { getPossibleTourMoves } from "../referee/rules/TourRules";
import { PieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Pion } from "./Pion";
import { Position } from "./Position";

export class Board{
    pieces: Piece[];
    totalTurns: number;
    winningTeam?: TeamType;
    
    constructor(pieces: Piece[], totalTurns: number){
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }

    //ALTERNANCE DE L'EQUIPE JOUANT SELON LE RESULTAT DU MODULO DU TOTAL DES TOURS PAR 2
    get currentTeam(): TeamType{
        return this.totalTurns%2 === 0 ? TeamType.ADVERSAIRE : TeamType.NOUS;
    }

    //CLONE L'ECHIQUIER ACTUEL AVEC SES PIECES AUX MEMES POSITIONS
    clone(): Board{
        return new Board(this.pieces.map(p => p.clone()), this.totalTurns);
    }

    //OBTENIR DEPLACEMENTS POSSIBLES DE TOUTES LES PIECES POUR LES VOIR
    getValidMoves(piece: Piece, boardState: Piece[]) : Position[]{
        switch(piece.type){
            case PieceType.PION:
                return getPossiblePionMoves(piece, boardState);
            case PieceType.CAVALIER:
                return getPossibleCavalierMoves(piece, boardState);
            case PieceType.FOU:
                return getPossibleFouMoves(piece, boardState);
            case PieceType.TOUR:
                return getPossibleTourMoves(piece, boardState);
            case PieceType.DAME:
                return getPossibleDameMoves(piece, boardState);
            case PieceType.ROI:
                return getPossibleRoiMoves(piece, boardState);
            default:
                return[];
        }
    }
    
    checkCurrentTeamMoves(){
        //TOUTES LES PIECES DE L'EQUIPE JOUANT ACTUELLEMENT
        for(const piece of this.pieces.filter(p => p.team === this.currentTeam)){
            if(piece.possibleMoves === undefined)
                continue;
            //SIMULER LES DEPLACEMENTS DE TOUTES LES PIECES
            for(const move of piece.possibleMoves){
                const simulatedBoard = this.clone();
                //SUPPRIME LA PIECE A LA DESTINATION
                simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));
                //OBTENIR LA PIECE DE L'ECHIQUIER CLONE
                const clonedPiece = simulatedBoard.pieces.find(p => p.samePiecePosition(piece))!;
                clonedPiece.position = move.clone();
                //OBTENIR LE ROI DE L'ECHIQUIER CLONE DE L'EQUIPE JOUANT
                const clonedRoi = simulatedBoard.pieces.find(p => p.isRoi && p.team === simulatedBoard.currentTeam)!;

                //MET A JOUR LES DEPLACEMENTS POSSIBLES DE TOUTES LES PIECES DE L'ADVERSAIRE
                //ET VERIFIE SI LE ROI DE L'EQUIPE JOUANT ACTUELLEMENT EST EN DANGER
                //SI EN DANGER => SUPPRIME LE DEPLACEMENT DES DEPLACEMENTS POSSIBLES
                for(const opponent of simulatedBoard.pieces.filter(p => p.team !== simulatedBoard.currentTeam)){
                    opponent.possibleMoves = simulatedBoard.getValidMoves(opponent, simulatedBoard.pieces);
                    if(opponent.isPion){
                        if(opponent.possibleMoves.some(p => p.x !== opponent.position.x && p.samePosition(clonedRoi.position)))
                            piece.possibleMoves = piece.possibleMoves.filter(p => !p.samePosition(move));
                    }
                    else if(opponent.possibleMoves.some(p => p.samePosition(clonedRoi.position))){
                        piece.possibleMoves = piece.possibleMoves.filter(p => !p.samePosition(move)); 
                    }
                }
            }
        }
    }
    
    calculateAllMoves(){
        //CALCULE LES DEPLACEMENTS POSSIBLES DE TOUTES LES PIECES
        for(const piece of this.pieces){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }

        //DEPLACEMENT SPECIAL (ROQUE)
        for(const roi of this.pieces.filter(p => p.isRoi)){
            if(roi.possibleMoves === undefined)
                continue;
            roi.possibleMoves = [...roi.possibleMoves, ...getCastlingMoves(roi, this.pieces)];
        }

        //VERIFIE SI LES DEPLACEMENTS DE L'EQUIPE JOUANT ACTUELLEMENT SONT POSSIBLES
        this.checkCurrentTeamMoves();

        //N'AFFICHE PAS LES DEPLACEMENTS POSSIBLES A L'EQUIPE NE JOUANT PAS ACTUELLEMENT
        for(const piece of this.pieces.filter(p => p.team !== this.currentTeam)){
            piece.possibleMoves = [];
        }

        //VERIFIE SI L'EQUIPE JOUANT ACTUELLEMENT A ENCORE DES DEPLACEMENTS POSSIBLES, SI NON => CHECKMATE
        if(this.pieces.filter(p => p.team === this.currentTeam).some(p => p.possibleMoves !== undefined && p.possibleMoves.length > 0))
            return;
        this.winningTeam = (this.currentTeam === TeamType.NOUS) ? TeamType.ADVERSAIRE : TeamType.NOUS;
    }

    playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position): boolean{
        const pionDirection = (playedPiece.team === TeamType.NOUS) ? 1 : -1;
        const destinationPiece = this.pieces.find(p => p.samePosition(destination));
        //DEPLACEMENT SPECIAL (ROQUE)
        if(playedPiece.isRoi && destinationPiece?.isTour && destinationPiece.team === playedPiece.team){
            //DETERMINE SI LA TOUR EST A GAUCHE OU A DROITE DU ROI
            const direction = (destinationPiece.position.x-playedPiece.position.x > 0) ? 1 : -1;
            const newRoiPosition = playedPiece.position.x+direction*2;
            this.pieces = this.pieces.map(p => {
                if(p.samePiecePosition(playedPiece))
                    p.position.x = newRoiPosition;
                else if(p.samePiecePosition(destinationPiece))
                    p.position.x = newRoiPosition-direction;
                return p;
            });
            this.calculateAllMoves();
            return true;
        }
        //DEPLACEMENT SPECIAL (EN PASSANT)
        if(enPassantMove){
            //MET A JOUR LA POSITION DE LA PIECE ET SI PIECE ATTAQUEE => PIECE SUPPRIMEE
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)){
                    if(piece.isPion)
                        (piece as Pion).enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                }
                else if(!piece.samePosition(new Position(destination.x, destination.y-pionDirection))){
                    if(piece.isPion)
                        (piece as Pion).enPassant = false;
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);
            this.calculateAllMoves();
        }
        //DEPLACEMENT NORMAL
        else if(validMove){
            //MET A JOUR LA POSITION DE LA PIECE ET SI PIECE ATTAQUEE => PIECE SUPPRIMEE
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)){
                    //DEPLACEMENT SPECIAL (EN PASSANT)
                    if(piece.isPion)
                        (piece as Pion).enPassant = Math.abs(playedPiece.position.y-destination.y) === 2 && piece.isPion;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                }
                else if(!piece.samePosition(destination)){
                    if(piece.isPion)
                        (piece as Pion).enPassant = false;
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);
            this.calculateAllMoves();
        }
        else{
           return false;
        }
        return true;
    }
    getPieceAtPosition(position: Position): Piece | undefined {
        return this.pieces.find(piece => piece.position.equals(position));
      }
}