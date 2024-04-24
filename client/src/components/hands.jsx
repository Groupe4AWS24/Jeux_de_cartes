import React from 'react';
import { BackCard, Card } from '../components/card';

export function PlayersHands({players, currentUser, currentColor, lastCard}) {

    /**
     * Une fonction qui génére des divs permettant la séparation de l'écran en 3 parties (en colonne), dont la partie du milieu sera divisé en 3 autres divs(en ligne).
     * Et pour chaque div, on affiche les mains des joueurs, la pioche la derniere carte joué et la carte actuelle.
     *
     * @return {JSX} - Retourne un composant React contenant notre affichage.
     */
    const Section = () => {

        const mains = Hands();
        console.log(mains)
        console.log(mains.otherPlayers[0])
        const {length} = mains.otherPlayers;
        console.log(length)
        return (
            <div className="flex-container">
                <div className='container_otherplayer'>
                    <div className="divlefttest divs">
                        {length >= 2 && mains.otherPlayers[1]}
                    </div>
                    <div className="divmidtest divs">
                        <div className='divtoptest divs'>
                            {length >= 1 && mains.otherPlayers[0]}
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
                        {length >= 3 && mains.otherPlayers[2]}
                    </div>
                </div>
                <div className='container_player'>
                    {mains.userHand}
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
        console.log(players)
        const listhands = [];
        const hands = {
            userHand : [],
            otherPlayers : listhands,
        }
        let i = 1;
        players.map((player) => (
            console.log(player.hand),
            //console.log(player.username, currentUser    ),
            player.username === currentUser ? (
                hands.userHand = 
                <div key={i} className={`hand_0`}>
                    {player.hand.map((carte,j) => (<Card key={j} valeur={carte}/>))}                     
                </div>
                //console.log(hands.userHand)
                )
            : ( listhands.push(<div key={i} className={`hand_${i}`}>  
                            {player.hand.map((carte,j) => (<BackCard key={j} joueur={i}/>))}
                        </div>),i += 1
            ) 
            )
          )
        return hands
    }

    // Retourne un composant contenant l'appel de la const Section.
    return (
        <>  
            <Section/>
        </>
    );
}