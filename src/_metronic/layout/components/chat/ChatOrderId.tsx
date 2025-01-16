import React from 'react';

interface ChatOrderIdProps {
  orderId: string;
  setOrderId: (id: string) => void;
  startChat: (type: string, id: string) => void;
}

const ChatOrderId: React.FC<ChatOrderIdProps> = ({ orderId, setOrderId, startChat }) => {
  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      <input
        type="text"
        placeholder="Masukkan Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button
        onClick={() => startChat("id", orderId)}
        style={buttonStyle}
      >
        Mulai Chat
      </button>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
};

export default ChatOrderId;