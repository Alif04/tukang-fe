import React from 'react';

// Define the props interface
interface ChatStartProps {
  handleChatTypeSelection: (option: string) => void; // Function that takes a string and returns void
  userRole: string; // userRole is a string
  handleEditMessage: () => void
}

const ChatStart: React.FC<ChatStartProps> = ({ handleChatTypeSelection, userRole, handleEditMessage }) => {
  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      <button onClick={() => handleChatTypeSelection("id")} style={buttonStyle}>1. Masukkan Order ID</button>
      {userRole === "Admin HO" ? (
        <button onClick={() => handleChatTypeSelection("store")} style={buttonStyle}>2. Chat dengan Store</button>
      ) : (
        <button onClick={() => handleChatTypeSelection("ho")} style={buttonStyle}>2. Chat dengan HO</button>
      )}
      {userRole === "Owner Vendor" ? (
        <button onClick={() => handleChatTypeSelection("store")} style={buttonStyle}>3. Chat dengan Store</button>
      ) : (
        <button onClick={() => handleChatTypeSelection("vendor")} style={buttonStyle}>3. Chat dengan Vendor</button>
      )}
      <button onClick={() => handleChatTypeSelection("previous")} style={buttonStyle}>4. Lihat Chat Sebelumnya</button>
       {userRole === "Admin HO" &&   <button onClick={handleEditMessage} style={buttonStyle}>5. Edit Text Awal</button>}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  backgroundColor: "white",
  color: "#020080f",
  border: "1px solid #020080", 
  marginBottom: "10px",
  borderColor:'#020080',
  cursor: "pointer",
};

export default ChatStart;