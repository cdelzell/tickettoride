import { useEffect, useState } from "react";

export function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      setReceivedMessage(event.data);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (msg) => {
    if (socket.readyState === WebSocket.OPEN) {
      // The WebSocket is open, so you can safely send the message
      socket.send(JSON.stringify(msg));
    } else {
      // If the WebSocket is not yet open, you can handle this case
      console.log("WebSocket is not open yet. Waiting for connection...");

      // Optionally, you can listen for the 'open' event and send the message then
      socket.addEventListener("open", () => {
        console.log("WebSocket connection established.");
        socket.send(JSON.stringify(msg)); // Now send the message
      });
    }
  };

  return { message, setMessage, receivedMessage, sendMessage };
}
