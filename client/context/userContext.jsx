// Imports
import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const UserContext = createContext({});

/**
 * Fonction qui donne accès au dashboard si un
 * token existe. Sinon, va sur la page home.
 *
 * @param children - Composant react
 */
export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
        // Si pas de token sera toujours renvoyé a la page d'accueil
        if (data && location.pathname !== '/chat' && !location.pathname.startsWith('/room/')) {
          navigate("/dashboard");
        } else if (!data){
          navigate("/");
        } else {

        }
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{user, setUser, socket, setSocket}}>
      {children}
    </UserContext.Provider>
  );
}