import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  const connectToSocketIO = () => {
    const newSocket = io("http://localhost:8000"); // Remplacez l'URL par celle de votre serveur
    setSocket(newSocket);
    authenticateWithSocketIO(newSocket);
  };

  const authenticateWithSocketIO = async (socket) => {
    const { data } = await axios.get("/profile");
    const { username } = data; // Remplacez par votre token JWT
    setUsername(username);
    console.log(username, socket)
    socket.emit("authenticate", username);
    socket.on("authenticated", (data) => {
      console.log(data);
    });
  };

  useEffect(() => {
    if (socket) {
      // Écoute l'événement "message"
      socket.on("message", (data) => {
        setMessages(prevMessages => [...prevMessages, data]);
      });
    }

    // Nettoie les écouteurs d'événements lors du démontage du composant
    // return () => {
    //   if (socket) {
    //     socket.off("message");
    //     socket.off("otherEvent");
    //   }
    // };
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit("message", {player : username , message :newMsg});
      setNewMsg("");
      console.log(messages)
    }
  }

  const disconnectFromSocketIO = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const handleConnectClick = () => {
    if (!socket) {
      connectToSocketIO();
    }
  };

  const handleDisconnectClick = () => {
    if (socket) {
      disconnectFromSocketIO();
    }
  };

  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index}>
        <strong>{msg.player}: </strong>
        {msg.message}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Test de connexion avec Socket.IO</h1>
      {!socket && <button onClick={handleConnectClick}>Connecter</button>}
      {socket && 
        <div>
          <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
          <button onClick={sendMessage}>Envoyer</button>
          <button onClick={handleDisconnectClick}>Déconnecter</button>
          <div>
            {renderMessages()}
          </div>
        </div>
        }
    </div>
  );
};

export default Chat;
