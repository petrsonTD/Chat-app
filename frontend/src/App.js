import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const [login, setLogin] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

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
      console.log(data.message); // "Logged in successfully"
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
      console.log("WebSocket connection closed:", event.reason);
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

  // async function onSubmit(event) {
  //   event.preventDefault();
  //   const data = new FormData(event.target);
  //   const formDataObj = Object.fromEntries(data.entries());
  
  //   console.log("formDataObj", formDataObj);
  
  //   // Create a new WebSocket connection
  //   const socket = new WebSocket("ws://localhost:8080");
  
  //   // Event triggered when the WebSocket connection opens
  //   socket.onopen = () => {
  //     // Send form data as JSON when the connection is established
  //     socket.send(JSON.stringify(formDataObj));
  //   };
  
  //   // Clear previous messages and set the WebSocket instance
  //   setMessages([]);
  //   setWs(socket);
  
  //   // Handle incoming messages from the server
  //   socket.onmessage = (event) => {
  //     if (event.data instanceof Blob) {
  //       event.data.text().then((text) => {
  //         setMessages((prevMessages) => [...prevMessages, text]);
  //       });
  //     } else {
  //       setMessages((prevMessages) => [...prevMessages, event.data]);
  //     }
  //   };
  
  //   // Handle WebSocket connection close or cleanup
  //   socket.onclose = () => {
  //     console.log("WebSocket connection closed.");
  //   };
  
  //   // Handle errors
  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };
  
  //   // Cleanup function to close the WebSocket when the component is unmounted
  //   // return () => {
  //   //   socket.close();
  //   // };
  // }

  function sendMessage() {
    if (ws && input) {
      ws.send(input);
      setInput("");
    } else {
      console.error("WebSocket is not connected");
    }
  }

  return (
    <>
      {!login && (
        <form method="post" onSubmit={handleLogin} className="absolute flex items-center justify-center min-h-screen w-screen backdrop-blur-sm">
          <div className="bg-slate-800 p-5 rounded-3xl shadow-[0_0px_50px_rgba(255,255,255,0.5)]">
            <div>
              <label htmlFor="username" className="block text-base font-semibold text-slate-200">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                required
                className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-slate-200"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-base font-semibold text-slate-200">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500  text-slate-200"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 p-1 mt-[1.7rem] mr-1 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button className="mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-700 transition duration-300 ease-in-out">
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

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
    </>
  );
}

export default App;
