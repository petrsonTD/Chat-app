import { useEffect, useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [login, setLogin] = useState(false);

  const loginUser = async (login) => {
    try {
      const response = await fetch("http://localhost:8080", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
        credentials: "include"
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed!");
      }
  
      const data = await response.json();
      console.log(data.message);
      return true;
    } catch (error) {
      console.error("Error during login:", error.message);
      return false;
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8080");
  
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    setWs(socket);
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
  
    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formDataObj = Object.fromEntries(data.entries());

    const isLoggedIn = await loginUser(formDataObj);

    if (isLoggedIn) {
      setLogin(true);
      connectWebSocket();
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        console.log("Closing WebSocket connection");
        ws.close();
      }
    };
  }, [ws]);

  return (
    <>
      {!login && <Login handleLogin={handleLogin} />}
      <Chat ws={ws} messages={messages} />
    </>
  );
}

export default App;
