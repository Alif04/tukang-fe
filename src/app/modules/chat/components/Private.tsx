/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useMemo, useRef, useState} from 'react'
import './Private.css'

interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  time: string // HH:mm
  day?: string // e.g. "Today", "Yesterday"
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
}

const initialConversations: Conversation[] = [
  {
    id: '6281122334455',
    name: 'Budi Santoso',
    phone: '+62 811-2233-4455',
    avatarText: 'BS',
    lastMessage: 'Baik kak, kami proses ya.',
    lastTime: '09:12',
    unread: 2,
    status: 'online',
    messages: [
      {id: 'm1', from: 'them', text: 'Halo kak, ini mengenai pesanan kemarin.', time: '09:01', day: 'Today'},
      {id: 'm2', from: 'me', text: 'Halo kak Budi, boleh detail nomor invoice-nya?', time: '09:05'},
      {id: 'm3', from: 'them', text: 'INV-2024-0912', time: '09:07'},
      {id: 'm4', from: 'me', text: 'Baik kak, kami proses ya.', time: '09:12'},
    ],
  },
  {
    id: '6289988776655',
    name: 'Siti Aisyah',
    phone: '+62 899-8877-6655',
    avatarText: 'SA',
    lastMessage: 'Terima kasih 🙏',
    lastTime: '08:40',
    unread: 0,
    status: 'offline',
    messages: [
      {id: 'm1', from: 'them', text: 'Apakah bisa pasang besok?', time: '08:21', day: 'Today'},
      {id: 'm2', from: 'me', text: 'Bisa kak, jam prefernya?', time: '08:32'},
      {id: 'm3', from: 'them', text: 'Siang sekitar jam 1.', time: '08:34'},
      {id: 'm4', from: 'me', text: 'Siap, dijadwalkan jam 13:00 ya.', time: '08:38'},
      {id: 'm5', from: 'them', text: 'Terima kasih 🙏', time: '08:40'},
    ],
  },
  {
    id: '6281234567890',
    name: 'Andi Wijaya',
    phone: '+62 812-3456-7890',
    avatarText: 'AW',
    lastMessage: 'Ada katalog terbaru?',
    lastTime: 'Kemarin',
    unread: 1,
    status: 'typing',
    messages: [
      {id: 'm1', from: 'them', text: 'Ada katalog terbaru?', time: '16:20', day: 'Yesterday'},
    ],
  },
  {
    id: '6287711223344',
    name: 'CS Mitra10',
    phone: '+62 877-1122-3344',
    avatarText: 'CS',
    lastMessage: 'Silakan isi form berikut ya.',
    lastTime: 'Sen',
    unread: 0,
    status: 'online',
    messages: [
      {id: 'm1', from: 'me', text: 'Halo CS, saya butuh bantuan pemasangan.', time: '11:02', day: 'Monday'},
      {id: 'm2', from: 'them', text: 'Silakan isi form berikut ya.', time: '11:05'},
    ],
  },
  {
    id: '6285566778899',
    name: 'Toko Mitra10 BSD',
    phone: '+62 855-6677-8899',
    avatarText: 'TB',
    lastMessage: 'Barang sudah sampai?',
    lastTime: 'Minggu',
    unread: 0,
    status: 'offline',
    messages: [
      {id: 'm1', from: 'them', text: 'Barang sudah sampai?', time: '10:10', day: 'Sunday'},
      {id: 'm2', from: 'me', text: 'Sudah, terima kasih.', time: '10:12'},
    ],
  },
]

const Private: FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string>(initialConversations[0]?.id || '')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.includes(q) || c.lastMessage.toLowerCase().includes(q)
    )
  }, [conversations, query])

  const active = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId]
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text || !active) return

    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')

    const newMsg: Message = {id: `${active.id}-${Date.now()}`, from: 'me', text, time: `${hh}:${mm}`}

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: text,
              lastTime: `${hh}:${mm}`,
              unread: 0,
            }
          : c
      )
    )
    setDraft('')
    setTimeout(scrollToBottom, 50)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className='wa-container'>
      <aside className='wa-sidebar'>
        <div className='wa-sidebar-header'>
          <div className='wa-profile'>
            <div className='wa-profile-avatar'>RH</div>
            <div>
              <div className='fw-semibold'>R. Hidayat</div>
              <div className='text-muted small'>Admin</div>
            </div>
          </div>
          <div className='wa-sidebar-actions'>
            <button className='wa-icon-btn' aria-label='status'>
              <i className='bi bi-circle-half'></i>
            </button>
            <button className='wa-icon-btn' aria-label='new chat'>
              <i className='bi bi-chat-left-text'></i>
            </button>
            <button className='wa-icon-btn' aria-label='menu'>
              <i className='bi bi-three-dots-vertical'></i>
            </button>
          </div>
        </div>
        <div className='wa-search'>
          <div className='wa-search-wrap'>
            <i className='bi bi-search'></i>
            <input
              className='wa-search-input'
              placeholder='Cari atau mulai chat baru'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className='wa-chat-list'>
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`wa-chat-item ${selectedId === c.id ? 'active' : ''}`}
              onClick={() => setSelectedId(c.id)}
            >
              <div className='wa-avatar'>{c.avatarText}</div>
              <div className='wa-chat-meta'>
                <div className='wa-chat-top'>
                  <div className='wa-chat-name'>{c.name}</div>
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
        {isCollapsed ? (
          <div className='wa-collapsed-handle'>
            <button className='wa-collapsed-btn' aria-label='expand' onClick={() => setIsCollapsed(false)}>
              <i className='bi bi-chevron-left'></i>
            </button>
          </div>
        ) : active ? (
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
                <button className='wa-icon-btn' aria-label='search in chat'>
                  <i className='bi bi-search'></i>
                </button>
                <button className='wa-icon-btn' aria-label='attachments'>
                  <i className='bi bi-paperclip'></i>
                </button>
                <button className='wa-icon-btn' aria-label='more'>
                  <i className='bi bi-three-dots-vertical'></i>
                </button>
              </div>
            </header>

            <section className='wa-messages'>
              {active.messages.map((m) => (
                <div key={m.id} className={`wa-bubble ${m.from === 'me' ? 'outgoing' : 'incoming'}`}>
                  <div dangerouslySetInnerHTML={{__html: m.text}} />
                  <span className='wa-bubble-time'>{m.time}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </section>

            <footer className='wa-input'>
              <button className='wa-icon-btn' aria-label='emoji'>
                <i className='bi bi-emoji-smile'></i>
              </button>
              <button className='wa-icon-btn' aria-label='attach'>
                <i className='bi bi-paperclip'></i>
              </button>
              <textarea
                className='wa-textarea'
                rows={1}
                placeholder='Ketik pesan'
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
              />
              {draft.trim() ? (
                <button className='wa-send-btn' onClick={sendMessage} aria-label='send'>
                  <i className='bi bi-send'></i>
                </button>
              ) : (
                <button className='wa-icon-btn' aria-label='mic'>
                  <i className='bi bi-mic'></i>
                </button>
              )}
            </footer>
          </>
        ) : (
          <div className='wa-empty'>Pilih percakapan di sebelah kiri</div>
        )}
      </main>
    </div>
  )
}

export {Private}
