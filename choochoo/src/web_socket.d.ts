// web_socket.d.ts
declare module "./web_socket.jsx" {
  export function useWebSocket(url: string): {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    receivedMessage: string;
    sendMessage: (msg: { type: string; value: string }) => void;
  };
}
