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
  messages: { sender: string; message: string }[];
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
        const unreadMessages = res.data.unreadCount.filter((msg:any) => msg.sender !== (userRole === "Owner Vendor" ? vendorName : userRole));
        
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

  const onSelectChat = async(chat: Chat) => {
    setSelectedChat(chat);
    handlePreviousChat(chat._id);
    try {
      const sender = userRole === "Owner Vendor" ? vendorName : userRole;
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
          <div>
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
                    backgroundColor: unreadChats.includes(chat.sender)
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
                        top: '12px',
                        right: '20px',
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
                {userRole === 'Admin HO' && (
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
                )}
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
          <h4 style={{ margin: '0 0 10px', color: '#333' }}>Chat</h4>
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
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign:
                    msg.sender === userRole || msg.sender === vendorName
                      ? 'right'
                      : 'left',
                  margin: '5px 0',
                }}
              >
                <strong>{msg.sender === userRole ? userRole : msg.sender}:</strong>{' '}
                {msg.message}
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
