import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setMessages([]);
    setWs(socket);

    socket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.text().then((text) => {
          setMessages((prevMessages) => [...prevMessages, text]);
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  function sendMessage() {
    if (ws && input) {
      ws.send(input);
      setInput("");
    }
  }

  return (
    <div className="p-6">
      <h1>Chat App</h1>
      <div className="border border-black p-2 h-[300px] overflow-y-scroll">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" ? sendMessage() : null}
        className="w-[80%] p-2 border border-black"
      />
      <button onClick={sendMessage} className="p-3 border border-black">Send</button>
    </div>
  );
}

export default App;
