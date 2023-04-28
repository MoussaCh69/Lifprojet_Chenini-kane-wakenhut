import { PieceType, TeamType } from './Types';
import { Piece } from './models/Piece';
import { Pion } from './models/Pion';
import { Position } from './models/Position';
import { Board } from './models/Board';

export const HORIZONTAL_AXIS = ["a","b","c","d","e","f","g","h"];
export const VERTICAL_AXIS = ["1","2","3","4","5","6","7","8"];
export const GRID_SIZE = 100;

//INITIALISATION DE L'ECHIQUIER AVEC TOUTES LES PLACES BIEN PLACEES
export const initialBoard = new Board([
    new Piece(
        new Position(0, 7), 
        PieceType.TOUR, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(1, 7),  
        PieceType.CAVALIER, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(2, 7), 
        PieceType.FOU, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(3, 7),  
        PieceType.DAME, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(4, 7), 
        PieceType.ROI, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(5, 7), 
        PieceType.FOU, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(6, 7), 
        PieceType.CAVALIER, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(7, 7), 
        PieceType.TOUR, 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(0, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(1, 6),  
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(2, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(3, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(4, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(5, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(6, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Pion(
        new Position(7, 6), 
        TeamType.ADVERSAIRE,
        false
    ),
    new Piece(
        new Position(0, 0), 
        PieceType.TOUR, 
        TeamType.NOUS,
        false
    ),
    new Piece(
        new Position(1, 0), 
        PieceType.CAVALIER, 
        TeamType.NOUS,
        false
    ),
    new Piece(
        new Position(2, 0), 
        PieceType.FOU, 
        TeamType.NOUS,
        false
    ),
    new Piece( 
        new Position(3, 0), 
        PieceType.DAME, 
        TeamType.NOUS,
        false
    ),
    new Piece(
        new Position(4, 0), 
        PieceType.ROI, 
        TeamType.NOUS,
        false
    ),
    new Piece(
        new Position(5, 0), 
        PieceType.FOU, 
        TeamType.NOUS,
        false
    ),
    new Piece(
        new Position(6, 0), 
        PieceType.CAVALIER, 
        TeamType.NOUS,
        false
    ),
    new Piece(
        new Position(7, 0), 
        PieceType.TOUR, 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(0, 1),  
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(1, 1), 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(2, 1), 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(3, 1), 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(4, 1), 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(5, 1), 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(6, 1), 
        TeamType.NOUS,
        false
    ),
    new Pion(
        new Position(7, 1), 
        TeamType.NOUS,
        false
    )
], 1);

initialBoard.calculateAllMoves();