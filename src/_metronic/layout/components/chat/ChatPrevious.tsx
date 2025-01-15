import React from 'react';

interface Chat {
  _id: string;
  members: string[];
  sender: string;

}

interface ChatPreviousProps {
  previousChats: Chat[];
  handlePreviousChat: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void;
  unreadChats: string[];
  userRole: string;
  messages: { sender: string; message: string }[];
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  vendorName:string
}

const ChatPrevious: React.FC<ChatPreviousProps> = ({ previousChats, handlePreviousChat, handleDeleteChat, unreadChats, userRole , messages, message, setMessage, sendMessage,vendorName}) => {
  return (
    <div
    style={{
      display: "flex", 
      height: "900px",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      overflow: "hidden",
      border: "1px solid #e0e0e0",
    }}
  >

    <div
      style={{
        width: "40%", 
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        backgroundColor: "#ffffff",
        padding: "10px",
      }}
    >
      <h4 style={{ margin: "0 0 10px", color: "#333" }}>Daftar Chat</h4>
      {previousChats.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", fontSize: "14px" }}>
          Tidak ada chat sebelumnya.
        </div>
      ) : (
        <div>
          {previousChats.map((chat: any) => (
            <div
              key={chat._id}
              style={{
                position: "relative",
                marginBottom: "10px",
              }}
            >
              <button
                onClick={() => handlePreviousChat(chat._id)}
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor: unreadChats.includes(chat.sender) ? "#e0f7fa" : "#f7f7f7", // Highlight for unread
                  border: "1px solidrgb(126, 95, 95)",
                  borderRadius: "8px",
                  textAlign: "left",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#333", fontWeight: "500" }}>
                  {chat.members && chat.members.length > 0
                    ? chat.members.join(", ")
                    : "No members"}

                  {unreadChats.includes(chat.sender) && (
                    <span style={{ color: "red", fontWeight: "bold" }}>New</span>
                  )}
                </span>
              </button>
              {userRole === "Admin HO" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat._id);
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "12px",
                    lineHeight: "1",
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

{/* Bagian Chat Aktif (Kanan) */}
      <div
        style={{
          flex: 1, // Bagian ini akan memenuhi sisa ruang
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h4 style={{ margin: "0 0 10px", color: "#333" }}>Chat</h4>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "white",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign:
                  msg.sender === userRole || msg.sender === vendorName
                    ? "right"
                    : "left",
                margin: "5px 0",
              }}
            >
              <strong>
                {msg.sender === userRole ? userRole : msg.sender}:
              </strong>{" "}
              {msg.message}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "10px",
          }}
        >
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
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
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
      </div>

  </div>
  );
};

export default ChatPrevious;