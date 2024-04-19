import React from 'react';
import { BackCard, Card } from '../components/card';

export function PlayersHands({playersDeck, currentUser, currentColor, lastCard, draw}) {

    /**
     * Une fonction qui génére des divs permettant la séparation de l'écran en 3 parties (en colonne), dont la partie du milieu sera divisé en 3 autres divs(en ligne).
     * Et pour chaque div, on affiche les mains des joueurs, la pioche la derniere carte joué et la carte actuelle.
     *
     * @return {JSX} - Retourne un composant React contenant notre affichage.
     */
    const Fection = () => {

        const mains = Hands();
        const length = mains.length;
        return (
            <div className="flex-container">
                <div className="divleft divs">
                    {length >= 2 && mains[1]}
                </div>
                <div className="divmid divs">
                    <div className='divrowtop'>
                        {length >= 3 && mains[2]}
                    </div>
                    <div className='divrowmid'>
                        <div className="draw">{
                            <BackCard key={0}/>
                        }</div>
                        <div className="circle"/>
                        <div className="lastcard">{
                            <Card key={0} valeur={
                                'purple_1'
                                /* à faire des qu'on une fonction pour une carte retourne sa valeur lastCard.length > 0 && lastCard[lastCard.length - 1]*/
                            }/>
                        }</div>
                    </div>
                    <div className='divrowbottom'>
                        {length >= 1 && mains[0]}
                    </div>
                </div>
                <div className="divright divs">
                    {length >= 4 && mains[3]}
                </div>  
            </div>
        )
    }

    const Section = () => {

        const mains = Hands();
        const {length} = mains;
        return (
            <div className="flex-container">
                <div className='container_otherplayer'>
                    <div className="divlefttest divs">
                        {length >= 2 && mains[1]}
                    </div>
                    <div className="divmidtest divs">
                        <div className='divtoptest divs'>
                            {length >= 3 && mains[2]}
                        </div>
                        <div className='divbottomtest divs'>
                            <div className="draw">{
                                <BackCard className="drawcard" key={0}/>
                            }</div>
                            <div className="circle"/>
                            <div className="lastcard">{
                                <Card key={0} valeur={
                                    'purple_1'
                                    /* à faire des qu'on une fonction pour une carte retourne sa valeur lastCard.length > 0 && lastCard[lastCard.length - 1]*/
                                }/>
                            }</div>
                        </div>
                    </div>
                    <div className="divrighttest divs">
                        {length >= 4 && mains[3]}
                    </div>
                </div>
                <div className='container_player'>
                    {length >= 1 && mains[0]}
                </div> 
            </div>
        )
    }


    
    /**
     * Une fonction qui génère une liste contenant les mains pour chaque joueur sous forme de composants React.
     * Sera utilisée dans le const Section pour simplifié la lisibilité du code.
     *
     * @return {array} Liste de composant React de la main de chaque joueur.
     */
    const Hands = () => {
        console.log(playersDeck)
        const listhands = [];
        Object.entries(playersDeck).map(([player_name,main],i) => (
            listhands.push(
                <div key={i} className={`hand_${i}`}>
                    {player_name === currentUser ? (
                        <>  {console.log(`hand_${i}`)}
                            {main.map((carte,j) => (<Card key={j} valeur={carte}/>))}                     
                        </>  
                    ) : (
                        <>  
                            {console.log(`hand_${i}`)}
                            {main.map((carte,j) => (<BackCard key={j} joueur={i}/>))}
                        </>
                    )}
                </div>
            )
          ))
        return listhands
    }

    // Retourne un composant contenant l'appel de la const Section.
    return (
        <>  
            <Section/>
        </>
    );
}