import React from 'react';
import './Tile.css';

//? = NON OBLIGATOIRE
interface Props{
    number: number;
    image?: string;
    highlight: boolean;
}

export default function Tile({number, image, highlight}: Props){
    //AJOUT DE CLASSES AUX CARREAUX
    const className: string = [
        "tile",
        //ALTERNANCE DE COULEUR DE CARREAUX SELON LE RESULTAT DU MODULO DU NUMERO DE CARREAU PAR 2
        number%2 === 0 && "black-tile",
        number%2 !== 0 && "white-tile",
        //SI HIGHLIGHT TRUE => AJOUTE LA CLASSE "TILE-HIGHLIGHT"
        highlight && "tile-highlight",
        //SI IMAGE NOT UNDEFINED => AJOUTE LA CLASSE "CHESS-PIECE-TILE"
        image && "chess-piece-tile"].filter(Boolean).join(' ');
    
    return(
        //TOUTES LES CLASSES AJOUTEES PRECEDEMMENT + AJOUT PIECES SUR LES CARREAUX AVEC LEURS IMAGES ET LA CLASSE "CHESS-PIECE"
        <div className={className}>
            {image && 
                <div 
                    style={{backgroundImage: `url(${image})`}} 
                    className="chess-piece">
                </div>
            }
        </div>
    ); 
}