import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <Component text="je sais pas"/>
      </div>
      <div class="card-container">
        <div className="card" id="card1"></div>
        <div className="card" id="card2"></div>
      </div>
    </>
  )
}

const Component = (props) => {
  return(
    <p>
      {props.text}
    </p>
  );
}

export default App

/* J'ai plus envie de coder, donc j'écris les idées, alors la gestions des cartes des utilisateur stocké 
dans une liste, s'il possède moins de 7 cartes dans la liste le dernier element sera null, si 6 les deux
derniers seront null, afficher la premiere cartes au centre, puis une carte sur deux à droite puis à gauche
de la principale
pour la création des cartes (affichage) passer par des props
pareil pour la couleur actuel passer par des props
*/