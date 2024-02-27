import React from 'react';
import { BackCard, Card } from '../components/card';

export function PlayersHands({playersDeck, currentUser}) {

    const Section = () => {

        const mains = Hands();
        const length = mains.length;
        return (
            <div className="flex-container">
                <div className="divleft divs">
                    {length >= 2 && mains[1]}
                </div>
                <div className="divmid divs">
                    <div className='divrowtop'>sub1
                    {length >= 3 && mains[2]}
                    </div>

                    <div className='divrowmid'>sub2

                    </div>
                    <div className='divrowbottom'>sub3
                        {length >= 1 && mains[0]}
                    </div>
                </div>
                <div className="divright divs">
                    {length >= 4 && mains[3]}
                </div>  
            </div>
        )
    }

    const Hands = () => {
        console.log(playersDeck)
        const listhands = [];
        Object.entries(playersDeck).map(([player_name,main],i) => (
            listhands.push(
                <div key={i} className={`hand_${i}`}>
                    {player_name === currentUser ? (
                        <>  {console.log(`hand_${i}`)}
                            {main.map((carte,i) => (<Card key={i} valeur={carte}/>))}                     
                        </>  
                    ) : (
                        <div className={`hand_${i}`}>
                            <>  
                                {console.log(`hand_${i}`)}
                                {main.map((carte,i) => (<BackCard key={i}/>))}
                            </>
                        </div>
                    )}
                </div>
            )
          ))
        return listhands
    }
    return (
        <>  
            <Section/>
        </>
    );
}