/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import axios from 'axios'
import './Private.css'

interface Message {
  id: string
  rawId?: number
  from: 'me' | 'them'
  text: string
  time: string // HH:mm or date string
  img?: string // 🟢 img
  document?: string // 🟢 file
}

interface Conversation {
  id: string
  name: string
  phone: string
  avatarText: string
  lastMessage: string
  lastTime: string
  unread?: number
  messages: Message[]
  status?: 'online' | 'offline' | 'typing'
  favorite?: boolean          // 🔹 NEW
  member_id?: string | null   // untuk cek member atau bukan
}


const API_BASE = process.env.REACT_APP_WA_BACKEND_API_URL

const formatTime = (isoOrSql: string | null | undefined) => {
  if (!isoOrSql) return ''
  const d = new Date(isoOrSql)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  if (sameDay) {
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    return `${hh}:${mm}`
  }
  return d.toLocaleDateString()
}

const getInitials = (name: string) => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}


const Private: FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'member' | 'favorite' | 'nonmember'>('member')

  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const conversationsRef = useRef<Conversation[]>([])
  const isFetchingConversationsRef = useRef<boolean>(false)
  const isFetchingDetailRef = useRef<boolean>(false)
  const [replyToId, setReplyToId] = useState<string | null>(null)

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  useEffect(() => {
    let mounted = true
    if (!API_BASE) {
      return () => {
        mounted = false
      }
    }
    
    const fetchConversations = async () => {
      if (isFetchingConversationsRef.current) return
      isFetchingConversationsRef.current = true
      try {
        const res = await axios.get(`${API_BASE}/conversation`, {
          params: {
            cat: activeTab // bisa 'all', 'read', atau 'favorite'
          }
        });
        const items = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []

        const favoriteIds = new Set(loadFavoriteIds()) // 🔹 NEW

        const mapped: Conversation[] = items.map((it: any) => {
          const id = String(it.phonenumber || it.id || '')
          return {
            id,
            name: String(it.name || ''),
            phone: String(it.phonenumber || ''),
            avatarText: getInitials(String(it.name || '')),
            lastMessage: String(it.last_message || ''),
            lastTime: formatTime(it.last_update || it.CreatedAt),
            unread: typeof it.unread === 'number' ? it.unread : 0,
            messages: [],
            status: 'offline',
            favorite: favoriteIds.has(id),                // 🔹 NEW
            member_id: it.member_id ? it.member_id : null   // untuk cek member atau bukan
          }
        })

        if (mounted) {
          setConversations((prev) => {
            const prevMap = new Map(prev.map((c) => [c.id, c]))
            const nextList = mapped.map((n) => {
              const ex = prevMap.get(n.id)
              return ex
                ? {
                    ...ex,
                    name: n.name,
                    phone: n.phone,
                    avatarText: n.avatarText,
                    lastMessage: n.lastMessage || ex.lastMessage,
                    lastTime: n.lastTime || ex.lastTime,
                    unread: n.unread ?? ex.unread ?? 0,
                    favorite: ex.favorite ?? n.favorite,   // 🔹 keep favorite
                  }
                : n
            })
            return nextList
          })
          if (!selectedId && mapped.length) setSelectedId(mapped[0].id)
        }
      } catch (e) {
        // keep previous state on error
      } finally {
        isFetchingConversationsRef.current = false
      }
    }

    // async function toggleFavorite(phone: any) {
    //   try {
    //     await axios.post(`${API_BASE}/favorite/${phone}`);
    //     fetchConversations(); // refresh list
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }


    fetchConversations()
        const intervalId = setInterval(fetchConversations, 5000)
        return () => {
          mounted = false
          clearInterval(intervalId)
        }
      }, [selectedId,activeTab])

      const toggleFavorite = async (id: string, phone: string) => {

        try {
          await axios.post(`${API_BASE}/conversation/favorite/${phone}`);
        } catch (err) {
          console.error(err);
        }
        setConversations((prev) => {
          const next = prev.map((c) =>
            c.id === id ? {...c, favorite: !c.favorite} : c
          )

          // sync ke localStorage
          const favIds = next.filter((c) => c.favorite).map((c) => c.id)
          saveFavoriteIds(favIds)

          return next
        })
      }


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => {
      const idMatch = String(c.id || '').toLowerCase().includes(q)
      const lastMsg = String(c.lastMessage || '').toLowerCase()
      return idMatch || lastMsg.includes(q)
    })
  }, [conversations, query])

  const active = useMemo(() => conversations.find((c) => c.id === selectedId) || null, [conversations, selectedId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedId(conv.id)
    const unreadCount = conv.unread || 0;

    // 🟢 Mark as read before fetch new details
    if (unreadCount > 0) {
      try {
        await axios.post(`${API_BASE}/conversation/read`, {
          phonenumber: conv.id,
          count: unreadCount
        });
      } catch (error) {
        console.error("Failed update unread:", error);
      }

      // 🟡 Optimistic UI: immediate update
      setConversations(prev => 
        prev.map(c => 
          c.id === conv.id ? { ...c, unread: 0 } : c
        )
      );
    }


    // if UI was collapsed, expand when user selects a conversation
    setIsCollapsed(false)
    if (!API_BASE) return
    if (isFetchingDetailRef.current) return
    try {
      // determine last_id from existing messages, if any
      const lastMsg = conv.messages && conv.messages.length ? conv.messages[conv.messages.length - 1] : null
      const lastId = lastMsg && typeof lastMsg.rawId === 'number' ? lastMsg.rawId : 0
      const max = parseInt(process.env.REACT_APP_CONVERSATION_MAX || '29', 10)

      const res = await axios.get(`${API_BASE}/conversation/detail/${conv.id}?last_id=${lastId}&max=${max}`)
      // Support multiple response shapes: res.data.data (array) or res.data.data.data (object with data array)
      const maybeData = res.data?.data
      let items: any[] = []
      if (Array.isArray(maybeData)) {
        items = maybeData
      } else if (maybeData && Array.isArray((maybeData as any).data)) {
        items = (maybeData as any).data
      } else if (Array.isArray(res.data)) {
        items = res.data
      } else {
        items = []
      }
      const mapped: Message[] = items.map((it: any) => ({
        id: `${String(it.id) || '0'}`,
        from: it.direction === 'incoming' ? 'them' : 'me',
        text: String(it.message|| ''),
        img: it.img || '', // 🟢 tambahkan ini
        document: it.document || '', // 🟢 tambahkan ini
        time: formatTime(it.CreatedAt || ''),
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv.id
            ? {
                ...c,
                messages: mapped,
                lastMessage: mapped.length ? mapped[mapped.length - 1].text : c.lastMessage,
                lastTime: mapped.length ? mapped[mapped.length - 1].time : c.lastTime,
                unread: 0,
              }
            : c
        )
      )
      setTimeout(scrollToBottom, 50)
    } catch (err) {
      console.error('Failed to fetch conversation detail', err)
    }
  }

  useEffect(() => {
    if (!API_BASE) return
    if (!selectedId) return
    let alive = true
    const poll = async () => {
      if (isFetchingDetailRef.current) return
      isFetchingDetailRef.current = true
      try {
        const conv = conversationsRef.current.find((c) => c.id === selectedId)
        const lastMsg = conv && conv.messages.length ? conv.messages[conv.messages.length - 1] : null
        const lastId = lastMsg && typeof lastMsg.rawId === 'number' ? lastMsg.rawId : 0
        const max = parseInt(process.env.REACT_APP_CONVERSATION_MAX || '29', 10)
        const res = await axios.get(`${API_BASE}/conversation/detail/${selectedId}?last_id=${lastId}&max=${max}`)
        const maybeData = res.data?.data
        let items: any[] = []
        if (Array.isArray(maybeData)) {
          items = maybeData
        } else if (maybeData && Array.isArray((maybeData as any).data)) {
          items = (maybeData as any).data
        } else if (Array.isArray(res.data)) {
          items = res.data
        }
        const mapped: Message[] = items.map((it: any) => ({
          id: `${String(it.id || it._id || Math.random())}`,
          rawId: typeof it.id === 'number' ? it.id : Number(it.id) || undefined,
          from: it.direction === 'incoming' ? 'them' : 'me',
          text: String(it.message || it.text || it.msg || ''),
          img: it.img || '', // 🟢 tambahkan ini
          document: it.document || '', // 🟢 tambahkan ini
          time: formatTime(it.CreatedAt || it.created_at || it.createdAt),
        }))
        if (!alive || mapped.length === 0) return
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== selectedId) return c
            const existingIds = new Set(c.messages.map((m) => m.id))
            const newMsgs = mapped.filter((m) => !existingIds.has(m.id))
            const merged = newMsgs.length ? [...c.messages, ...newMsgs] : c.messages
            return {
              ...c,
              messages: merged,
              lastMessage: merged.length ? merged[merged.length - 1].text : c.lastMessage,
              lastTime: merged.length ? merged[merged.length - 1].time : c.lastTime,
            }
          })
        )
        setTimeout(scrollToBottom, 50)
      } catch (err) {
        // silent fail
      } finally {
        isFetchingDetailRef.current = false
      }
    }
    poll()
    const id = setInterval(poll, 3000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [selectedId])

  const sendMessage = async () => {
    const text = draft.trim()
    if (!text || !active) return

    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')

    const newMsg: Message = {id: `${active.id}-${Date.now()}`, from: 'me', text, time: `${hh}:${mm}`}

    // // Optimistic UI update
    // setConversations((prev) =>
    //   prev.map((c) =>
    //     c.id === active.id
    //       ? {
    //           ...c,
    //           messages: [...c.messages, newMsg],
    //           lastMessage: text,
    //           lastTime: `${hh}:${mm}`,
    //           unread: 0,
    //         }
    //       : c
    //   )
    // )
    setDraft('')
    setTimeout(scrollToBottom, 50)

    // Send to backend
    try {
      const payload = {
        phonenumber: active.id,
        message: text,
        location: '',
        img: '',
        audio: '',
        video: '',
        document: '',
        types:'Agent',
        reply_to_id: replyToId || '',   // ADD THIS
      }
      await axios.post(`${API_BASE}/conversation`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      setReplyToId(null); // reset replyToId setelah mengirim file
      // Optionally, you could refresh the conversation list or update message id/status here
    } catch (err) {
      console.error('Failed to send message', err)
      // Optionally: show user feedback or revert optimistic update
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(e.target.value);
      
      // Auto resize
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    };



  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const FAVORITES_KEY = 'waFavorites';

  const loadFavoriteIds = (): string[] => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveFavoriteIds = (ids: string[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!msgId) return;

    const result = window.confirm("Yakin ingin menghapus pesan ini?");
    if (!result) return;

    try {
      await axios.post(`${API_BASE}/conversation/deletechatdetail/${msgId}`);
      console.log("Pesan terhapus:", msgId);
      // 🧹 Hapus bubble di panel langsung
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedId
            ? {
                ...c,
                messages: c.messages.filter(m => m.id !== msgId)
              }
            : c
        )
      );
    } catch (err) {
      console.error("Gagal hapus pesan", err);
    }
  };
  const handleDeleteConversation = async (phone: string) => {
    const confirmDelete = window.confirm(`Hapus seluruh chat dengan ${phone}?`);
    if (!confirmDelete) return;

    try {
      await axios.post(`${API_BASE}/conversation/deletechat/${phone}`);
      
      // Update UI setelah delete
      setConversations(prev => prev.filter(c => c.phone !== phone));

      if (selectedId === phone) {
        setSelectedId(''); // jika yang dihapus sedang dibuka
      }

    } catch (err) {
      console.error("Gagal hapus percakapan", err);
    }
  };

  // 1️⃣ Cari pesan yang sedang direply
  const replyMessage = useMemo(() => {
    if (!replyToId || !active) return null;
    return active.messages.find((m) => m.id === replyToId) || null;
  }, [replyToId, active]);

  const ReplyPreview: FC<{ message: Message; onCancel: () => void; activeName: string }> = ({ message, onCancel, activeName }) => {
    if (!message) return null;

    return (
      <div className="wa-reply-preview">
        <div className="wa-reply-header">
          <span className="wa-reply-from">{message.from === 'me' ? 'Anda' : activeName}</span>
          <button className="wa-reply-cancel" onClick={onCancel} title="Batal reply">
            ✖
          </button>
        </div>
        <div className="wa-reply-text">
          {message.text.length > 150 ? message.text.slice(0, 150) + '...' : message.text}
        </div>
      </div>
    );
  };


  return (
    <div className='wa-container'>
      <aside className='wa-sidebar'>
        <div className='wa-sidebar-header'>
          <div className='wa-profile'>
            {(() => {
              const userName = localStorage.getItem('username') || ''
              const userRole = localStorage.getItem('userRole') || ''
              const initials = getInitials(userName || 'Admin WA')
              return (
                <>
                  <div className='wa-profile-avatar'>{initials}</div>
                  <div>
                    <div className='fw-semibold'>{userName || 'Admin WA'}</div>
                    <div className='text-muted small'>{userRole || 'Admin WA'}</div>
                  </div>
                </>
              )
            })()}
          </div>
          <div className='wa-sidebar-actions'>
            <button
              className='wa-icon-btn'
              aria-label='toggle-search'
              onClick={() => {
                setShowSearch((prev) => {
                  const next = !prev
                  if (next) setTimeout(() => searchInputRef.current?.focus(), 50)
                  return next
                })
              }}
            >
              <i className='bi bi-search'></i>
            </button>
          </div>
        </div>
        {showSearch && (
          <div className='wa-search'>
            <div className='wa-search-wrap'>
              <i className='bi bi-search'></i>
              <input
                ref={searchInputRef}
                className='wa-search-input'
                placeholder='Cari atau mulai chat baru'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className='wa-tabs'>
          <button
            className={`wa-tab-btn ${activeTab === 'member' ? 'active' : ''}`}
            onClick={() => setActiveTab('member')}
          >
            Member
          </button>
          <button
            className={`wa-tab-btn ${activeTab === 'favorite' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorite')}
          >
            Favorite
          </button>
          <button
            className={`wa-tab-btn ${activeTab === 'nonmember' ? 'active' : ''}`}
            onClick={() => setActiveTab('nonmember')}
          >
            Non Member
          </button>
        </div>


        <div className='wa-chat-list'>
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`wa-chat-item ${selectedId === c.id ? 'active' : ''}`}
              onClick={() => handleSelectConversation(c)}
            >
              <div className='wa-avatar'>{c.avatarText}</div>
                <div className='wa-chat-meta'>
                  <div className='wa-chat-top'>
                    <div className='wa-chat-name d-flex align-items-center gap-1'>
                      {c.name}
                       {/* ⭐ Favorite toggle */}
                        {c.member_id ? (
                          <button
                            className='wa-star-btn'
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(c.id, c.phone)
                            }}
                          >
                            <i className={c.favorite ? 'bi bi-star-fill text-warning' : 'bi bi-star'}></i>
                          </button>
                        ) : null}

                        {/* 🗑 Delete conversation */}
                        <button
                          className='wa-delete-chat-btn'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConversation(c.phone)
                          }}
                          title="Hapus seluruh chat"
                        >
                          <i className='bi bi-trash'></i>
                        </button>
                    </div>
                  <div className='d-flex align-items-center gap-1'>
                    <span className='wa-chat-time'>{c.lastTime}</span>
                    {c.unread ? <span className='wa-unread'>{c.unread}</span> : null}
                  </div>
                </div>

                <div className='wa-chat-last'>{c.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className={`wa-main ${isCollapsed ? 'collapsed' : ''}`}>
        {!isCollapsed && active ? (
          <>
            <header className='wa-main-header'>
              <div className='wa-main-contact'>
                <div className='wa-avatar wa-avatar-sm'>{active.avatarText}</div>
                <div>
                  <div className='wa-main-name'>{active.name}</div>
                  <div className='wa-main-status'>
                    {active.status === 'typing' ? 'mengetik…' : active.status === 'online' ? 'online' : active.phone}
                  </div>
                </div>
              </div>
              <div className='wa-main-actions'>
                <button className='wa-icon-btn' aria-label='minimize' onClick={() => setIsCollapsed(true)}>
                  <i className='bi bi-chevron-right'></i>
                </button>
                {/* removed search, attachments, and menu icons */}
              </div>
            </header>

            <section className='wa-messages'>
              {active.messages.map((m) => {
                const imageUrl = m.img ? `${API_BASE}${m.img}` : null;
                const documentUrl = m.document ? `${API_BASE}${m.document}` : null;

                return (
                  <div key={m.id} className={`wa-bubble ${m.from === 'me' ? 'outgoing' : 'incoming'}`}>
                    
                    {/* 🗑 DELETE BUTTON → hanya untuk pesan yang dikirim oleh admin/me */}
                    {m.from === 'me' && (
                      <button
                        className="wa-delete-btn"
                        title="Hapus pesan ini"
                        onClick={() => handleDeleteMessage(m.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                   {/* 📨 Tombol reply sebagai icon saja */}
                   {/* {m.from === 'them' && ( */}
                      <button
                        className="wa-reply-btn"
                        title="Reply"
                        onClick={() => setReplyToId(m.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          marginLeft: 8
                        }}
                      >
                        <i className="bi bi-reply-fill" style={{ fontSize: 16, color: "#555" }}></i>
                      </button>
                   {/* )} */}

                    {imageUrl && (
                      <img width={250} src={imageUrl} alt="attachment" className="wa-bubble-image" />
                    )}

                    {documentUrl && (
                      <div className="wa-bubble-doc">
                        <i className="bi bi-file-earmark-text" style={{ fontSize: 20, marginRight: 8 }}></i>
                        <a href={documentUrl} download target="_blank" rel="noopener noreferrer">
                          Download File
                        </a>
                      </div>
                    )}

                    {m.text && !documentUrl && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: m.text.replace(/\n/g, '<br/>'),
                        }}
                      />
                    )}

                    <span className="wa-bubble-time">{m.time}</span>
                  </div>
                );
              })}


              <div ref={messagesEndRef} />
            </section>


            <footer className='wa-input'>
              
              {replyMessage && (
                <ReplyPreview message={replyMessage} onCancel={() => setReplyToId(null)} activeName={active.name} />
              )}

              <div className="wa-input-row">
                {/* 📎 Tombol upload */}
                <div className='wa-attach'>
                  <label htmlFor='file-upload' className='wa-icon-btn' title='Upload file'>
                    <i className='bi bi-paperclip'></i>
                  </label>
                  <input
                    id='file-upload'
                    ref={fileInputRef}
                    type='file'
                    accept='image/*,application/pdf,.doc,.docx,.xls,.xlsx'
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();

                      reader.onload = async (event) => {
                        const base64Data = event.target?.result as string;
                        if (!base64Data) return;

                        const now = new Date();
                        const hh = now.getHours().toString().padStart(2, '0');
                        const mm = now.getMinutes().toString().padStart(2, '0');

                        const tempMessage: Message = {
                          id: `upload-${Date.now()}`,
                          from: 'me',
                          text: file.name,
                          time: `${hh}:${mm}`,
                        };

                        // setConversations((prev: Conversation[]) =>
                        //   prev.map((c: Conversation) =>
                        //     c.id === selectedId
                        //       ? { ...c, messages: [...c.messages, tempMessage] }
                        //       : c
                        //   )
                        // );

                        try {
                          const payload = {
                            phonenumber: selectedId,
                            message: '',
                            location: '',
                            img: file.type.startsWith('image/') ? base64Data : '',
                            document: !file.type.startsWith('image/') ? base64Data : '',
                            audio: '',
                            video: '',
                            reply_to_id: replyToId || '',   // ADD THIS
                            types : 'Agent',
                          };

                          await axios.post(`${API_BASE}/conversation`, payload, {
                            headers: { 'Content-Type': 'application/json' },
                          });
                          setReplyToId(null); // reset replyToId setelah mengirim file
                        } catch (err) {
                          console.error('Failed to send file', err);
                        }

                        // 🧹 PENTING: reset nilai input agar bisa upload file yang sama lagi
                        e.target.value = '';
                      };

                      reader.readAsDataURL(file);
                    }}


                  />
                </div>



                {/* 💬 Textarea pesan */}
                <textarea
                  className='wa-textarea'
                  rows={1}
                  placeholder='Ketik pesan'
                  value={draft}
                  onChange={handleDraftChange}  // ⬅ pakai fungsi baru
                  onKeyDown={onKeyDown}
                />

                {/* 📨 Tombol kirim */}
                {draft.trim() ? (
                  <button className='wa-send-btn' onClick={sendMessage} aria-label='send'>
                    <i className='bi bi-send'></i>
                  </button>
                ) : null}
              </div>
            </footer>

          </>
        ) : (
          <div className='wa-empty'>Pilih percakapan di sebelah kiri</div>
        )}
      </main>

      {isCollapsed && (
        <div className='wa-collapsed-handle'>
          <button className='wa-collapsed-btn' aria-label='expand' onClick={() => setIsCollapsed(false)}>
            <i className='bi bi-chevron-left'></i>
          </button>
        </div>
      )}
    </div>
    </div>
  )

}

export {Private}