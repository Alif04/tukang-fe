import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";

const socket = io(`${process.env.REACT_APP_API_CHAT_URL}`);

export default function ChatPage(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<string>("start");
  const [steps, setSteps] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [orderId, setOrderId] = useState<string>("");
  const [chatType, setChatType] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [vendorList, setVendorList] = useState<{ id: string; store_name: string }[]>([]);
  const [loadingVendors, setLoadingVendors] = useState<boolean>(false);
  const [previousChats, setPreviousChats] = useState<any>([]);
  const [page, setPage] = useState(1); // Pagination state
  const [newMessages, setNewMessages] = useState(false);
  const [unreadChats, setUnreadChats] = useState<any>([]);
  const userRole = localStorage.getItem("userRole") as string;
  const storeName = localStorage.getItem("storeName") as string;
  const storeId = localStorage.getItem("storeId") as string;
  const vendorName = localStorage.getItem("vendorName") as string;
  const vendorId = localStorage.getItem("vendor_id") as string;

  const vendorListRef = useRef<HTMLDivElement>(null); // Reference for vendor list container
  const poveuesiListRef = useRef<HTMLDivElement>(null); // Reference for vendor list container
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiChat = process.env.REACT_APP_API_CHAT_URL
  useEffect(() => {
    console.log("masukk sini");
    console.log(messages);
    
    if (messages.length > 0 && !isOpen) {
      console.log("masuk sini");
      
      setNewMessages(true);
      // Add to unread chats
      setUnreadChats((prev: any) => {
        const lastChat = messages[messages.length - 1];
        if (!prev.includes(lastChat.sender)) {
          return [...prev, lastChat.sender];
        }
        return prev;
      });
    }
  }, [messages, isOpen]);

  // Function to fetch vendor data based on the current page
  const fetchVendors = async (page: number) => {
    setLoadingVendors(true);
    try {
      const ttype = chatType === "vendor" ? "vendor" : "stores"
      let apiUrlWithParams = `${apiUrl}/${ttype}?order_by=desc&page=${page}&take=10`; // Update query parameters as needed

      if (userRole === "Store CS") {
        apiUrlWithParams += `&store_id=${storeId}`;
      }

      if (userRole === "Owner Vendor") {
        apiUrlWithParams += `&vendor_id=${vendorId}`;
      }
      const res = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (res.data && res.data.data) {
        setVendorList((prevList) => [...prevList, ...res.data.data]); // Append new vendors to the list
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      alert("Gagal memuat daftar vendor.");
    } finally {
      setLoadingVendors(false);
    }
  };

  // Handle scrolling behavior
  const handleScroll = () => {
    const container = vendorListRef.current;
    if (container) {
      const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;
      if (bottom && !loadingVendors) {
        setPage((prevPage) => prevPage + 1); // Increment page number when scrolled to the bottom
        fetchVendors(page + 1);
      }
    }
  };


  useEffect(() => {
    const handleReceiveMessage = (msg: { sender: string; message: string }) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { sender: "chatbot", message: "Selamat datang! Silakan pilih salah satu opsi berikut:" },
      ]);
    }
  }, [isOpen]);

  const handleChatTypeSelection = async (option: string) => {
    setChatType(option);

    if (option === "id") {
      setMessages((prev) => [
        ...prev,
        { sender: "chatbot", message: "Silakan isi Order ID Anda." },
      ]);
      setStep("orderId");
    } else if (option === "ho") {
      await startChat("ho", {});
    } else if (option === "vendor") {
      setLoadingVendors(true);
      try {
        let apiUrlWithParams = `${apiUrl}/vendor?order_by=desc&page=${page}&take=10`; // Update query parameters as needed
        if (userRole === "Store CS") {
          apiUrlWithParams += `&store_id=${storeId}`;
        }
        const res = await axios.get(apiUrlWithParams, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setVendorList(res.data.data);
        setMessages([
          { sender: "chatbot", message: "Silakan pilih vendor:" },
        ]);
        setStep("vendor");
      } catch (err) {
        console.error(err);
        alert("Gagal memuat daftar vendor.");
      } finally {
        setLoadingVendors(false);
      }
    } else if (option === "store") {
      setLoadingVendors(true);

      try {
        let apiUrlWithParams = `${apiUrl}/stores?order_by=desc&page=${page}&take=10`; // Update query parameters as needed
        if (userRole === "Owner Vendor") {
          apiUrlWithParams += `&vendor_id=${vendorId}`;
        }
        const res = await axios.get(apiUrlWithParams, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        setVendorList(res.data.data);
        setMessages([
          { sender: "chatbot", message: "Silakan pilih store:" },
        ]);
        setStep("vendor");
      } catch (err) {
        console.error(err);
        alert("Gagal memuat daftar vendor.");
      } finally {
        setLoadingVendors(false);
      }
    } else if (option === "previous") {
      setMessages((prev) => [
        ...prev,
        { sender: "chatbot", message: "Silakan pilih chat sebelumnya:" },
      ]);
      fetchPreviousChats();
      setStep("previous");
    }
  };

  const startChat = async (type: string, datas: any) => {

    try {
      if (userRole === "Admin HO" && (type === "store" || type === "vendor" || type === "id")) {
        let payload: any = {
          role_admin: "Admin HO",
          role: userRole,
          option: type,
        };
        if (type === "vendor") {
          payload.vendor = {
            name: datas.company_name,
            id: datas.id
          };
        } else if (type === "store") {
          payload.store = {
            name: datas.store_name,
            id: datas.id
          };
        }

        // If type is "id", you can handle it as needed
        if (type === "id") {

          let apiUrlWithParams = `${apiUrl}/orders/${orderId}`; // Update query parameters as needed
          const res = await axios.get(apiUrlWithParams, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          });
          if (res.status === 200) {
            payload.store = {
              name: res.data.data.store.store_name,
              id: res.data.data.store_id
            };
            payload.vendor = {
              name: res.data.data.vendor.company_name,
              id: res.data.data.vendor_id
            };
          }

        }


        const res = await axios.post(`${apiChat}/chat/createGroup`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.data.success) {
          setGroupId(res.data.groupId);
          setStep("chat");
          setMessages((prev) => [
            ...prev,
            { sender: "chatbot", message: `Anda telah bergabung ke grup ${res.data.groupId}.` },
          ]);
          socket.emit("joinGroup", res.data.groupId);
        } else {
          alert("Gagal memulai chat.");
        }


      } else if (userRole === "Store CS" && (type === 'ho' || type === 'vendor' || type === "id")) {
        let payload: any = {
          role_admin: "Admin HO",
          role: userRole,
          option: type,
          store: storeName
        };
        if (type === "vendor") {
          payload.vendor = {
            name: datas.company_name,
            id: datas.id
          };
        }
        if (type === "id") {

          let apiUrlWithParams = `${apiUrl}/orders/${orderId}`; // Update query parameters as needed
          const res = await axios.get(apiUrlWithParams, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          });
          if (res.status === 200) {

            if (parseInt(storeId) === res.data.data.store_id) {
              payload.vendor = {
                name: res.data.data.vendor.company_name,
                id: res.data.data.vendor_id
              };
            } else {
              setMessages((prev) => [
                ...prev,
                { sender: "chatbot", message: "Order ID ini bukan Milik Anda." },
              ]);
              setMessages((prev) => [
                ...prev,
                { sender: "chatbot", message: "Silakan isi Order ID Anda." },
              ]);
              setStep("orderId");
            }
          }

        }
        const res = await axios.post(`${apiChat}/chat/createGroup`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.data.success) {
          setGroupId(res.data.groupId);
          setStep("chat");
          setMessages((prev) => [
            ...prev,
            { sender: "chatbot", message: `Anda telah bergabung ke grup ${res.data.groupId}.` },
          ]);
          socket.emit("joinGroup", res.data.groupId);
        } else {
          alert("Gagal memulai chat.");
        }
      } else if (userRole === "Owner Vendor" && (type === 'ho' || type === 'store' || type === "id")) {
        let payload: any = {
          role_admin: "Admin HO",
          role: userRole,
          option: type,
          vendor: vendorName
        };
        if (type === "store") {
          payload.store = {
            name: datas.store_name,
            id: datas.id
          };
        }
        if (type === "id") {

          let apiUrlWithParams = `${apiUrl}/orders/${orderId}`; // Update query parameters as needed
          const res = await axios.get(apiUrlWithParams, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          });
          if (res.status === 200) {

            if (parseInt(vendorId) === res.data.data.vendor_id) {
              payload.store = {
                name: res.data.data.store.store_name,
                id: res.data.data.store_id
              };
            } else {
              setMessages((prev) => [
                ...prev,
                { sender: "chatbot", message: "Order ID ini bukan Milik Anda." },
              ]);
              setMessages((prev) => [
                ...prev,
                { sender: "chatbot", message: "Silakan isi Order ID Anda." },
              ]);
              setStep("orderId");
            }
          }

        }
        const res = await axios.post(`${apiChat}/chat/createGroup`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.data.success) {
          setGroupId(res.data.groupId);
          setStep("chat");
          setMessages((prev) => [
            ...prev,
            { sender: "chatbot", message: `Anda telah bergabung ke grup ${res.data.groupId}.` },
          ]);
          socket.emit("joinGroup", res.data.groupId);
        } else {
          alert("Gagal memulai chat.");
        }
      }

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "chatbot", message: "Data order tidak ditemukan" },
      ]);
      setMessages((prev) => [
        ...prev,
        { sender: "chatbot", message: "Silakan isi Order ID Anda." },
      ]);
      setStep("orderId");
      // alert("Terjadi kesalahan.");
    }
  };

  const resetChat = () => {
    setIsOpen(false);
    setStep("start");
    setMessage("");
    setMessages([]);
    setOrderId("");
    setChatType("");
    setGroupId("");
    setVendorList([]);
    setLoadingVendors(false);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      groupId,
      organisasi: 'Mitra 10',
      sender: userRole === "Owner Vendor" ? vendorName : userRole,
      message,
    };

    socket.emit("sendMessage", msg);
    setMessage("");
  };
  console.log(unreadChats);
  
  const fetchPreviousChats = async () => {
    try {

      const role = userRole === "Admin HO" ? userRole : userRole === "Store CS" ? storeName : vendorName
      const res = await axios.get(`${apiChat}/chat/previousChats/${role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {

        setPreviousChats(res.data.groups);
      }

    } catch (err) {
      console.error(err);
      alert("Gagal memuat chat sebelumnya.");
    }
  };

  const handlePreviousChat = async (groupId: any) => {
    setGroupId(groupId);
    setSteps('riwayatChat')
    socket.emit("joinGroup", groupId);
    try {
      const res = await axios.get(`${apiChat}/chat/messages/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.status === 200) {
        setMessages(res.data);
      } else {
        alert("Gagal mengambil pesan grup.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengambil pesan grup.");
    }
    setUnreadChats((prev: any) => prev.filter((id: any) => id !== groupId));
  };

  const handleDeleteChat = (id: any) => {
    Swal.fire({
      title: "Kamu Yakin Menghapus Chat ini?",
      text: "Data Chat Akan Terhapus Selamanya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.delete(`${apiChat}/chat/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          fetchPreviousChats()
        }

      }
    });
  }
  return (
    <div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => {
            if (isOpen) {
              resetChat();
            } else {
              if (newMessages) {
                setIsOpen(true);
                setStep("previous")
                setSteps('')
              } else {
                setIsOpen(true);
              }
         
            }
          }}
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "90%",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            fontSize: "24px", // Adjust the font size here
          }}
        >
          {isOpen ? "X" : "💬"}
          {newMessages && isOpen === false && (
            <span
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "5px",
                fontSize: "12px",
              }}
            >
              !
            </span>
          )}
        </button>

        {isOpen && (
          <div
            style={{
              width: step === "previous" ? "900px" : "300px",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginTop: "10px",
            }}
          >

            <div
              style={{
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                display: "flex", // Untuk membuat layout fleksibel
                alignItems: "center",
                justifyContent: "space-between", // Memberi ruang antara ikon dan judul
              }}
            >
              {step !== "start" && (
                <button
                  onClick={() => {
                    setStep("start")
                    setSteps('')
                    setMessages([
                      { sender: "chatbot", message: "Selamat datang! Silakan pilih salah satu opsi berikut:" },
                    ]);
                    setOrderId("");
                    setChatType("");
                    setGroupId("");
                    setVendorList([]);
                    setLoadingVendors(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>⬅</span> {/* Icon Kembali */}
                </button>
              )}
              <span style={{ flex: 1, textAlign: step !== "start" ? "center" : "left" }}>
                Layanan Chat
              </span>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                backgroundColor: "#f9f9f9",
              }}
            // Add reference to the container
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: (msg.sender === userRole || msg.sender === vendorName) ? "right" : "left",
                    margin: "5px 0",
                  }}
                >
                  <strong>{msg.sender === userRole ? userRole : msg.sender}:</strong>{" "}
                  {msg.message}
                </div>
              ))}
            </div>
            {step === "start" && (
              <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
                <button onClick={() => handleChatTypeSelection("id")} style={buttonStyle}>1. Masukkan Order ID</button>
                {userRole === "Admin HO" ? <button onClick={() => handleChatTypeSelection("store")} style={buttonStyle}>2. Chat dengan Store</button> :
                  <button onClick={() => handleChatTypeSelection("ho")} style={buttonStyle}>2. Chat dengan HO</button>}
                {userRole === "Owner Vendor" ? <button onClick={() => handleChatTypeSelection("store")} style={buttonStyle}>2. Chat dengan Store</button> : <button onClick={() => handleChatTypeSelection("vendor")} style={buttonStyle}>3. Chat dengan Vendor</button>}
                <button onClick={() => handleChatTypeSelection("previous")} style={buttonStyle}>4. Lihat Chat Sebelumnya</button>
              </div>
            )}
            {step === "previous" && (
              <div
                style={{
                  display: "flex", // Flex container untuk layout horizontal
                  height: "900px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}
              >
                {/* Bagian List Chat (Kiri) */}
                <div
                  style={{
                    width: "40%", // Atur lebar list chat
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
                {steps === "riwayatChat" &&
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
                  </div>}

              </div>
            )}
            {step === "vendor" && (
              <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
                {loadingVendors ? (
                  <div>Loading vendor list...</div>
                ) : (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }} ref={vendorListRef} onScroll={handleScroll}>
                    {vendorList.map((vendor: any) => (
                      <button
                        key={vendor.id}
                        onClick={() => startChat(chatType, vendor)}
                        style={buttonStyle}
                      >
                        {chatType === "vendor" ? vendor.company_name : vendor.store_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {step === "orderId" && (
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
            )}
            {step === "chat" && (
              <div style={{ display: "flex", borderTop: "1px solid #ccc", padding: "10px" }}>
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(); // Kirim pesan saat tombol Enter ditekan
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
};
