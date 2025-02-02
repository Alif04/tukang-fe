import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Chat {
  _id: string;
  members: string[];
  sender: string;

}

interface ChatPreviousProps {
  previousChats: Chat[];
  handlePreviousChat: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void;
  unreadChats: string[]; // Optional, but can be managed here
  userRole: string;
  messages: any;
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  vendorName: string;

}
const apiChat = process.env.REACT_APP_API_CHAT_URL
const ChatPrevious: React.FC<ChatPreviousProps> = ({
  previousChats,
  handlePreviousChat,
  handleDeleteChat,
  unreadChats,
  userRole,
  messages,
  message,
  setMessage,
  sendMessage,
  vendorName,

}) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({}); // Map for unread counts
  const [latestMessages, setLatestMessages] = useState<{ [key: string]: string }>({});
  const fetchUnreadCounts = async () => {
    const counts: { [key: string]: number } = {};
    for (const chat of previousChats) {
      try {
        const res = await axios.get(`${apiChat}/chat/unread/${chat._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const unreadMessages = res.data.unreadCount.filter((msg: any) => msg.sender !== (userRole === "Owner Vendor" ? vendorName : userRole === "Super User" ? "Admin HO" : userRole));

        counts[chat._id] = unreadMessages.length || 0;
      } catch (err) {
        console.error(`Failed to fetch unread count for chat ${chat._id}`, err);
        counts[chat._id] = 0;
      }
    }
    setUnreadCounts(counts);
  };

  const fetchNewChat = async () => {
    const latest: { [key: string]: string } = {};
    for (const chat of previousChats) {
      try {
        const res = await axios.get(`${apiChat}/chat/messages/${chat._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(res);

        if (res.data && res.data.length > 0) {
          res.data.forEach((chats: any) => {
            const { groupId, timestamp } = chats;
            if (!latest[groupId] || new Date(timestamp) > new Date(latest[groupId])) {
              latest[groupId] = timestamp; // Simpan timestamp terbaru untuk setiap grup
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch new chats", err);
      }
    }
    setLatestMessages(latest);
  };
  // console.log(latestMessages);

  useEffect(() => {
    // Fetch unread messages for each chat

    fetchNewChat()
    fetchUnreadCounts();
  }, [previousChats]);

  const onSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    handlePreviousChat(chat._id);
    try {
      const sender = userRole === "Owner Vendor" ? vendorName : userRole === "Super User" ? 'Admin HO' : userRole;
      await axios.put(`${apiChat}/chat/status/${chat._id}`, { sender }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUnreadCounts()
      console.log('Chat status updated to read');
    } catch (err) {
      console.error('Failed to update chat status:', err);
    }
  };
  const sortedChats = [...previousChats].sort((a, b) => {
    const timestampA = latestMessages[a._id] || "1970-01-01T00:00:00.000Z";
    const timestampB = latestMessages[b._id] || "1970-01-01T00:00:00.000Z";
    return new Date(timestampB).getTime() - new Date(timestampA).getTime();
  });

  return (
    <div
      style={{
        display: 'flex',
        height: '900px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Sidebar Chat List */}
      <div
        style={{
          width: '40%',
          borderRight: '1px solid #ccc',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          padding: '10px',
        }}
      >
        <h4 style={{ margin: '0 0 10px', color: '#333' }}>Daftar Chat</h4>
        {previousChats.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
            Tidak ada chat sebelumnya.
          </div>
        ) : (
          <div style={{ marginTop: 10 }}>
            {sortedChats.map((chat) => {
              return <div
                key={chat._id}
                style={{
                  position: 'relative',
                  marginBottom: '10px',
                }}
              >

                <button
                  onClick={() => onSelectChat(chat)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: selectedChat?._id === chat._id
                      ? '#e0f7fa'
                      : '#f7f7f7', // Highlight for unread
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#333', fontWeight: '500' }}>
                    {chat.members && chat.members.length > 0
                      ? chat.members.join(', ')
                      : 'No members'}
                  </span>
                  {/* Unread count in the top right corner */}
                  {unreadCounts[chat._id] > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0px',
                        right: '2px',
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '50%',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {unreadCounts[chat._id]}
                    </span>
                  )}
                </button>
                {/* {userRole === 'Admin HO' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat._id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0px', // Slightly adjusted for better placement
                      right: '2px', // Adjust to move to the top right corner
                      backgroundColor: '#ff4d4f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '12px',
                      lineHeight: '1',
                      zIndex: 10, // Ensures the button is on top
                    }}
                  >
                    X
                  </button>
                )} */}
              </div>
            })}
          </div>
        )}
      </div>

      {/* Active Chat Section */}
      {selectedChat && (
        <div
          style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h4 style={{ margin: 0, color: "#333" }}>Chat</h4>
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              {/* Button for menu */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                onClick={() => {
                  handleDeleteChat(selectedChat._id);
                  setSelectedChat(null); // Reset selected chat
                  // const menu = document.getElementById("chat-menu");
                  // if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
                }}
              >
                <i className="bi bi-trash"></i>
              </button>

              {/* Dropdown menu */}
              {/* <div
          id="chat-menu"
          style={{
            display: "none",
            position: "absolute",
            top: "20px",
            right: "0",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => {
              handleDeleteChat(selectedChat._id);
              setSelectedChat(null); // Reset selected chat
              const menu = document.getElementById("chat-menu");
              if (menu) menu.style.display = "none";
            }}
            style={{
              padding: "10px",
              width: "100%",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            Hapus Chat
          </button>
        </div> */}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: 'white',
            }}
          >
            {messages.map((msg: any, idx: any) => (
              <div
                key={idx}
                style={{
                  textAlign:
                    msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                      msg.sender === vendorName
                      ? 'right'
                      : 'left',
                  marginBottom: '10px',
                }}
              >
                {/* Nama pengirim */}
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '5px',
                  }}
                >
                  {msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole)
                    ? userRole === 'Super User'
                      ? 'Admin HO'
                      : userRole
                    : msg.sender}
                </div>

                {/* Kotak pesan */}
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor:
                      msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                        msg.sender === vendorName
                        ? '#007BFF'
                        : '#f1f1f1',
                    color:
                      msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                        msg.sender === vendorName
                        ? 'white'
                        : '#333',
                    padding: '10px',
                    borderRadius: '8px',
                    maxWidth: '60%',
                    wordBreak: 'break-word',
                    position: 'relative',
                  }}
                >
                  {msg.message}
                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(14, 13, 13, 0.7)',
                      textAlign: 'right',
                      marginTop: '5px',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: '10px',
            }}
          >
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: '10px',
                padding: '10px',
                backgroundColor: '#007BFF',
                color: 'white',
                borderRadius: '5px',
                border: 'none',
              }}
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPrevious;
