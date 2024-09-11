import { useState } from "react";

function Chat({ws, setWs, setLogin, messages, setMessages}) {
  const [input, setInput] = useState("");

  function sendMessage() {
    if (ws && input) {
      ws.send(input);
      setInput("");
    } else {
      console.error("WebSocket is not connected");
    }
  }

  async function handleLogout() {
    try {
      // Request the server to clear the session
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Logout failed!");
      }

      // Close WebSocket connection
      if (ws) {
        ws.close();
      }

      // Clear state and redirect to login
      setLogin(false);
      setMessages([]);
      setWs(null);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (      
    <div className="p-6 min-h-screen bg-slate-900 flex flex-col">
      <div className="flex flex-row w-full justify-between">
        <h1 className="text-slate-50 text-3xl">chat-app</h1>
        <button onClick={handleLogout} className="mt-1 ml-3 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-700 transition duration-300 ease-in-out">
          Logout
        </button>
      </div>
      <div className="bg-slate-300 mt-5 p-2 grow overflow-y-scroll">
        {messages.map(msg => (
          <p key={msg.id}>
            <span className="mr-1">
              {`${msg.username}:`}
            </span>
            <span>
              {msg.message}
            </span>
          </p>
        ))}
      </div>
      <div className="mt-1 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" ? sendMessage() : null}
          className="grow p-1 mr-1"
        />
        <button onClick={sendMessage} className="p-1 px-5 bg-slate-400 hover:bg-slate-500 active:bg-slate-600">Send</button>
      </div>
    </div>
  );
}

export default Chat;
