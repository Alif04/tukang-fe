import React from 'react';

interface ChatActiveProps {
  messages: { sender: string; message: string }[];
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
}

const ChatActive: React.FC<ChatActiveProps> = ({ messages, message, setMessage, sendMessage }) => {
  return (
    <div style={{ display: "flex", borderTop: "1px solid #ccc", padding: "10px" }}>
      <input
        type="text"
        placeholder="Ketik pesan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Kirim
      </button>
    </div>
  );
};

export default ChatActive;