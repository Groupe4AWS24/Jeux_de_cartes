import react,{ useState } from 'react'
import './App.css'
import Page1 from './pages/one_page'

function App() {

  return (
      /* <div> 
        <Component text="je sais pas"/>
      </div>*/
      
      <div className='App'>
        <Page1/>
      </div>
    /*
      <div className='App'>
        <Login/>
      </div>*/
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