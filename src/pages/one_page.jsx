import React, { useEffect, useState } from 'react';
import './one_page.css';
import { BackCard, Card } from '../components/card';
import { PlayersHands } from '../components/hands';


function Page1() {
    
    
    const [currentUser, setCurrentUser] = useState("");
    const [users, setUsers] = useState([]);
    const [end,setEnd] = useState(false);
    const [ranking,setRanking] = useState([]);
    const [playersDeck, setPlayersDeck] = useState({});
    const [currentColor, setCurrentColor] = useState("");
    const [currentNumber, setCurrentNumber] = useState(0);
    const [draw, setDraw] = useState([]);
    const [turn, setTurn] = useState(0);
    const [fosse, setFosse] = useState([]);
    const [test,setTest] = useState(false);
    useEffect(() => {
        // Vérifier si playersDeck est vide
        if (Object.keys(playersDeck).length === 0) {
            // Effectuer les actions nécessaires seulement si playersDeck est vide
            setPlayersDeck({ 
                "thanu": ["purple_1", "purple_1","purple_1", "purple_1"],
                "inconnu": ["purple_1", "purple_1"],
                "versatile": ["purple_1", "purple_1"],
                "pastèque épicée": ["purple_1", "purple_1"]
            });
            setCurrentUser("thanu");
        }
    }, [test]);

    return (
        // represente le board, on lui applique un effet CSS.
        <div className="board">
            {/*On regarde si la partie est fini via un opérateur ternaire, si oui on affiche le classement, 
                sinon on execute le necessaire pour le fonctionnement de la partie*/}
            {end ? <div>
                {
                true && 
                    <>
                        <h1>La partie est fini voici le classement</h1>
                    </>
                } </div> : 
                <div className='hands'> {test === false && setTest(true)}
                    <PlayersHands playersDeck={playersDeck} currentUser={currentUser} currentColor={currentColor} lastCard={fosse} draw={draw}/>
                </div>
            }
        </div>
    );
}

export default Page1;