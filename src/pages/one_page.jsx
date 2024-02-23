import React, { useState } from 'react';
import './one_page.css';
import { BackCard } from '../components/card';


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
                <div>
                    {Object.entries(playersDeck).map(([cle,valeur],i) => (
                        cle === currentUser ? <div className={`hand_${i}`} key={i}></div> :
                        <div className={`handback_${i}`} key={i} ></div>
                        // pour chaque carte de la main utilise le BackCard
                        
                    ))}
                    <BackCard key ={0} item = {null} />
                </div>
            }
        </div>
    );
}

export default Page1;