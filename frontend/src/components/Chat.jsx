import { useState } from "react";

function Chat({ws, messages}) {
  const [input, setInput] = useState("");

  function sendMessage() {
    if (ws && input) {
      ws.send(input);
      setInput("");
    } else {
      console.error("WebSocket is not connected");
    }
  }

  return (      
    <div className="p-6 min-h-screen bg-slate-900 flex flex-col">
      <h1 className="text-slate-50 text-3xl">Chat App</h1>
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
