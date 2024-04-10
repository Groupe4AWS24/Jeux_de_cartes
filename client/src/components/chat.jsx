import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  // Différentes variables utilisées dans l'application, pour gérer l'état coté client.
  const [socket, setSocket] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(null);
  const [maxPlayer, setMaxPlayer] = useState(0);
  const [valRoom, setValRoom] = useState("");
  const [errorJoin, setErrorJoin] = useState("");

  /**
   * Définit le nouveau socket et s'authentifie avec Socket.IO.
   */
  const connectToSocketIO = () => {
    const newSocket = io("http://localhost:8000"); // Remplacez l'URL par celle de votre serveur
    setSocket(newSocket);
    authenticateWithSocketIO(newSocket);
  };

  /**
   * Envoi son nom d'utilisateur au serveur Socket.IO.
   *
   * @param {Object} socket - L'objet socket Socket.IO.
   * @param {string} username - Le nom d'utilisateur pour l'authentification.
   */
  const authenticateWithSocketIO = async (socket) => {
    const { data } = await axios.get("/profile");
    const { username } = data; // Remplacez par votre token JWT
    setUsername(username);
    console.log(username, socket);
    socket.emit("authenticate", username);
    socket.on("authenticated", (data) => {
      //console.log(data);
    });
  };
  /*
   *Un hook pour chaque changment sur le socket affiche et recupère ses modifications.
   */
  useEffect(() => {
    if (socket) {
      // Écoute l'événement "message"
      socket.on("message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        console.log(data);
      });
    }
  }, [socket]);

  /**
   * Envoie le message du joueur au serveur avec et le numéro de la room et le nom d'utilisateur.
   */
  const sendMessage = () => {
    if (socket) {
      socket.emit("message", {
        player: username,
        message: newMsg,
        room: parseInt(valRoom),
      });
      setNewMsg("");
    }
  };

  /*
   * Fonction pour se désconnecter du serveur Socket.IO.
   */
  const disconnectFromSocketIO = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  
  /**
   * Fonction pour se connecter au serveur Socket.Io, lorqu'on clique sur le bouton se connecter.
   */
  const handleConnectClick = () => {
    if (!socket) {
      connectToSocketIO();
    }
  };

  /**
   * Fonction pour se déconnecter au serveur Socket.Io, lorqu'on clique sur le bouton se déconnecter.
   */
  const handleDisconnectClick = () => {
    if (socket) {
      disconnectFromSocketIO();
    }
  };

  /*
   * Fonction pour afficher les messages.
  */
  const renderMessages = () => {
    console.log(messages);
    return messages.map((msg, index) => (
      <div key={index}>
        <strong>{msg.player}: </strong>
        {msg.message}
      </div>
    ));
  };
  /**
   * Fonction pour creer une nouvelle room, avec un nombre limité de joueurs.
   */
  const createRoom = () => {
    if (maxPlayer <= 4) {
      console.log("maxPlayer: ", maxPlayer);
      if (socket) {
        setRoom(true);
        console.log("room: ", room);
        socket.emit("createRoom", { maxPlayers: maxPlayer });
        socket.on("roomCreated", (data) => {
          console.log("roomID: ", data);
          setValRoom(data.roomId);
        });
      }
    }
  };

  /**
   * Rejointe une room, tant que cette dernière existe et pas pleine.
   */
  const join = () => {
    if (socket) {
      console.log("room: ", valRoom);
      socket.emit("joinRoom", { roomId: valRoom });
      socket.on("roomJoined", (data) => {
        console.log("roomID: ", data);
        setRoom(true);
      });
      socket.on("error", (data) => {
        console.log("roomID: ", data);
        setErrorJoin(data);
      });
    }
  };

  return (
    <div className="App">
      <h1>Test de connexion avec Socket.IO</h1>
      {!socket && <button onClick={handleConnectClick}>Connecter</button>}
      {socket && (
        <div>
          {room ? (
            <div>
              <h2>{`Room n°${valRoom}`}</h2>
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
              />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={maxPlayer}
                onChange={(e) => setMaxPlayer(e.target.value)}
              />
              <button onClick={createRoom}>Create la room</button>
              <br />
              <input
                type="text"
                value={valRoom}
                onChange={(e) => setValRoom(e.target.value)}
              />
              <button onClick={join}>Join la room</button>
              <span>{errorJoin}</span>
            </div>
          )}
          <button onClick={handleDisconnectClick}>Déconnecter</button>
          <div>{renderMessages()}</div>
        </div>
      )}
    </div>
  );
};

export default Chat;
