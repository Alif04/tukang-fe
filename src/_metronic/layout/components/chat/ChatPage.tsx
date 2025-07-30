/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef} from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import Swal from 'sweetalert2'
import ChatStart from './ChatStart'
import ChatVendor from './ChatVendor'
import ChatOrderId from './ChatOrderId'
import ChatActive from './ChatActive'
import ChatPrevious from './ChatPrevious'
import EditMessageModal from './EditMessageModal'
import {toAbsoluteUrl} from '../../../helpers'
import {Button, Modal} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComment} from '@fortawesome/free-solid-svg-icons'

const socket = io(`${process.env.REACT_APP_API_CHAT_URL}/live-chat`)

export default function ChatPage(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [step, setStep] = useState<string>('start')
  const [steps, setSteps] = useState<string>('')
  const [message, setMessage] = useState<any>()
  const [messages, setMessages] = useState<{sender: string; message: string; timestamp: any}[]>([])
  const [orderId, setOrderId] = useState<string>('')
  const [chatType, setChatType] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const [reciver, setReciver] = useState<any>([])
  const [organisasiId, setOrganisasiId] = useState<string>('')
  const [vendorList, setVendorList] = useState<{id: string; store_name: string}[]>([])
  const [StoreList, setStoreList] = useState<{id: string; store_name: string}[]>([])
  const [loadingVendors, setLoadingVendors] = useState<boolean>(false)
  const [previousChats, setPreviousChats] = useState<any>([])
  const [page, setPage] = useState(1) // Pagination state
  const [newMessages, setNewMessages] = useState<any>(false)
  const [unreadChats, setUnreadChats] = useState<any>([])
  const userRole = localStorage.getItem('userRole') as any
  const storeName = localStorage.getItem('storeName') as string
  const storeId = localStorage.getItem('storeId') as string
  const vendorName = localStorage.getItem('vendorName') as string
  const vendorId = localStorage.getItem('vendor_id') as string
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [previewImage, setPreviewImage] = useState('')
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const vendorListRef = useRef<HTMLDivElement>(null) // Reference for vendor list container
  const poveuesiListRef = useRef<HTMLDivElement>(null) // Reference for vendor list container
  const apiUrl = process.env.REACT_APP_API_URL
  const apiChat = process.env.REACT_APP_API_CHAT_URL
  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      // setNewMessages(true)
      // Add to unread chats
      setUnreadChats((prev: any) => {
        const lastChat = messages[messages.length - 1]
        if (!prev.includes(lastChat.sender)) {
          return [...prev, lastChat.sender]
        }
        return prev
      })
    }
  }, [messages, isOpen])

  // Function to fetch vendor data based on the current page
  const fetchVendors = async (page: number) => {
    setLoadingVendors(true)
    try {
      const ttype = chatType === 'vendor' ? 'vendor' : 'stores'
      let apiUrlWithParams = `${apiUrl}/${ttype}?order_by=desc&page=${page}&take=10` // Update query parameters as needed

      if (userRole === 'Store CS') {
        apiUrlWithParams += `&store_id=${storeId}`
      }

      if (userRole === 'Owner Vendor') {
        apiUrlWithParams += `&vendor_id=${vendorId}`
      }
      const res = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (res.data && res.data.data) {
        if (chatType === 'vendor') {
          setVendorList((prevList) => [...prevList, ...res.data.data]) // Append new vendors to the list
        } else {
          setStoreList((prevList) => [...prevList, ...res.data.data])
        }
      }
    } catch (err) {
      console.error('Error fetching vendors:', err)
      alert('Gagal memuat daftar vendor.')
    } finally {
      setLoadingVendors(false)
    }
  }

  const GetVendor = async () => {
    // setLoadingVendors(true);
    let apiUrlWithParams = `${apiUrl}/vendor?order_by=desc&page=${page}&take=10` // Update query parameters as needed
    if (userRole === 'Store CS') {
      apiUrlWithParams += `&store_id=${storeId}`
    }

    if (searchQuery) {
      apiUrlWithParams += `&search=${searchQuery}`
    }
    const res = await axios.get(apiUrlWithParams, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
      },
    })
    setVendorList(res.data.data)
    // setLoadingVendors(false);
  }
  const getStore = async () => {
    // setLoadingVendors(true);
    let apiUrlWithParams = `${apiUrl}/stores?order_by=desc&page=${page}&take=10` // Update query parameters as needed
    if (userRole === 'Owner Vendor') {
      apiUrlWithParams += `&vendor_id=${vendorId}`
    }
    if (searchQuery) {
      apiUrlWithParams += `&search=${searchQuery}`
    }
    const res = await axios.get(apiUrlWithParams, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
      },
    })

    setStoreList(res.data.data)
    // setLoadingVendors(false);
  }
  useEffect(() => {
    getStore()
    GetVendor()
  }, [searchQuery])
  // Handle scrolling behavior
  const handleScroll = () => {
    const container = vendorListRef.current
    if (container) {
      const bottom = container.scrollHeight === container.scrollTop + container.clientHeight
      if (bottom && !loadingVendors) {
        setPage((prevPage) => prevPage + 1) // Increment page number when scrolled to the bottom
        fetchVendors(page + 1)
      }
    }
  }

  useEffect(() => {
    const handleReceiveMessage = (msg: {sender: string; message: string; timestamp: any}) => {
      if (
        msg.sender !==
        (userRole === 'Owner Vendor'
          ? vendorName
          : userRole === 'Super User'
          ? 'Admin HO'
          : userRole === 'Store CS'
          ? storeName
          : userRole)
      ) {
        if (!isOpen) {
          setNewMessages(true)
          setUnreadCount((prev) => prev + 1) // Tambah counter
        }
      }
      setMessages((prev) => [...prev, msg])
    }

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [socket, isOpen])
  const datasss = async () => {
    const res = await axios.get(`${apiChat}/chat/organisasi/Mitra 10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    setOrganisasiId(res.data.groups._id)
    const timestamp = new Date()

    setMessages([
      {
        sender: 'Mitra 10',
        message: res.data.groups.description,
        timestamp,
      },
    ])
  }
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      datasss()
    }
  }, [isOpen])

  const handleChatTypeSelection = async (option: string) => {
    setChatType(option)
    const timestamp = new Date()
    if (option === 'id') {
      setMessages((prev) => [
        ...prev,
        {sender: 'Mitra 10', message: 'Silakan isi Order ID Anda.', timestamp},
      ])
      setStep('orderId')
    } else if (option === 'ho') {
      await startChat('ho', {})
    } else if (option === 'vendor') {
      setLoadingVendors(true)
      try {
        setMessages([{sender: 'Mitra 10', message: 'Silakan pilih vendor:', timestamp}])
        setStep('vendor')
      } catch (err) {
        console.error(err)
        alert('Gagal memuat daftar vendor.')
      } finally {
        setLoadingVendors(false)
      }
    } else if (option === 'store') {
      setLoadingVendors(true)

      try {
        setMessages([{sender: 'Mitra 10', message: 'Silakan pilih store:', timestamp}])
        setStep('vendor')
      } catch (err) {
        console.error(err)
        alert('Gagal memuat daftar vendor.')
      } finally {
        setLoadingVendors(false)
      }
    } else if (option === 'previous') {
      setMessages((prev) => [
        ...prev,
        {sender: 'Mitra 10', message: 'Silakan pilih chat sebelumnya:', timestamp},
      ])
      fetchPreviousChats()
      setStep('previous')
    }
  }

  const startChat = async (type: string, datas: any) => {
    const timestamp = new Date()
    try {
      let payload: any = {}

      // Admin HO/Super User logic
      if (
        (userRole === 'Admin HO' || userRole === 'Super User') &&
        (type === 'store' || type === 'vendor' || type === 'id')
      ) {
        payload = {
          role_admin: 'Admin HO',
          role: userRole === 'Super User' ? 'Admin HO' : userRole,
          option: type,
        }

        if (type === 'vendor') {
          payload.vendor = {
            name: datas.company_name,
            id: datas.id,
          }
        } else if (type === 'store') {
          payload.store = {
            name: datas.store_name,
            id: datas.id,
          }
        }

        if (type === 'id') {
          // IMPORTANT: Pass orderId ke backend
          payload.orderId = orderId

          let apiUrlWithParams = `${apiUrl}/orders/${orderId}`
          const res = await axios.get(apiUrlWithParams, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          if (res.status === 200) {
            payload.store = {
              name: res.data.data.store.store_name,
              id: res.data.data.store_id,
            }
            payload.vendor = {
              name: res.data.data.vendor.company_name,
              id: res.data.data.vendor_id,
            }
          }
        }
      }
      // Store CS logic
      else if (userRole === 'Store CS' && (type === 'ho' || type === 'vendor' || type === 'id')) {
        payload = {
          role_admin: 'Admin HO',
          role: userRole,
          option: type,
          store: storeName,
        }

        if (type === 'vendor') {
          payload.vendor = {
            name: datas.company_name,
            id: datas.id,
          }
        }

        if (type === 'id') {
          // IMPORTANT: Pass orderId ke backend
          payload.orderId = orderId

          let apiUrlWithParams = `${apiUrl}/orders/${orderId}`
          const res = await axios.get(apiUrlWithParams, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          if (res.status === 200) {
            if (parseInt(storeId) === res.data.data.store_id) {
              payload.vendor = {
                name: res.data.data.vendor.company_name,
                id: res.data.data.vendor_id,
              }
            } else {
              setMessages((prev) => [
                ...prev,
                {sender: 'Mitra 10', message: 'Order ID ini bukan Milik Anda.', timestamp},
              ])
              setMessages((prev) => [
                ...prev,
                {sender: 'Mitra 10', message: 'Silakan isi Order ID Anda.', timestamp},
              ])
              setStep('orderId')
              return
            }
          }
        }
      }
      // Owner Vendor logic
      else if (
        userRole === 'Owner Vendor' &&
        (type === 'ho' || type === 'store' || type === 'id')
      ) {
        payload = {
          role_admin: 'Admin HO',
          role: userRole,
          option: type,
          vendor: vendorName,
        }

        if (type === 'store') {
          payload.store = {
            name: datas.store_name,
            id: datas.id,
          }
        }

        if (type === 'id') {
          // IMPORTANT: Pass orderId ke backend
          payload.orderId = orderId

          let apiUrlWithParams = `${apiUrl}/orders/${orderId}`
          const res = await axios.get(apiUrlWithParams, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          if (res.status === 200) {
            if (parseInt(vendorId) === res.data.data.vendor_id) {
              payload.store = {
                name: res.data.data.store.store_name,
                id: res.data.data.store_id,
              }
            } else {
              setMessages((prev) => [
                ...prev,
                {sender: 'Mitra 10', message: 'Order ID ini bukan Milik Anda.', timestamp},
              ])
              setMessages((prev) => [
                ...prev,
                {sender: 'Mitra 10', message: 'Silakan isi Order ID Anda.', timestamp},
              ])
              setStep('orderId')
              return
            }
          }
        }
      }

      // MAJOR CHANGE: Handle new backend response structure
      const res = await axios.post(`${apiChat}/chat/createGroup`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (res.data.success) {
        const dataReciver = res.data.group.members.filter(
          (member: any) =>
            member !==
            (userRole === 'Owner Vendor'
              ? vendorName
              : userRole === 'Super User'
              ? 'Admin HO'
              : userRole === 'Store CS'
              ? storeName
              : userRole)
        )

        setReciver(dataReciver)
        setGroupId(res.data.groupId)

        // NEW LOGIC: Handle existing vs new group
        if (res.data.isExisting) {
          // Existing group found - redirect to previous chat
          console.log('Existing group detected, redirecting to previous chat...')

          setStep('previous')
          setMessages((prev) => [
            ...prev,
            {
              sender: 'Mitra 10',
              message: res.data.message || 'Mengarahkan ke chat yang sudah ada...',
              timestamp,
            },
          ])

          // Fetch previous chats first to ensure data is available
          await fetchPreviousChats()

          // Auto-load the existing chat after a short delay
          setTimeout(() => {
            // handlePreviousChat(res.data.groupId)
            setSteps('autoRedirect')
            // Optional: Show additional message
            setMessages((prev) => [
              ...prev,
              {
                sender: 'Mitra 10',
                message: 'Chat history dimuat.',
                timestamp: new Date(),
              },
            ])
          }, 1500)
        } else {
          // New group - proceed with normal chat flow
          console.log('New group created, proceeding to chat...')

          setStep('chat')
          setMessages((prev) => [
            ...prev,
            {
              sender: 'Mitra 10',
              message: res.data.message || 'Anda telah bergabung ke grup baru.',
              timestamp,
            },
          ])
          socket.emit('joinGroup', res.data.groupId)
        }
      } else {
        alert('Gagal memulai chat.')
      }
    } catch (err) {
      console.error('Error in startChat:', err)
      setMessages((prev) => [
        ...prev,
        {sender: 'Mitra 10', message: 'Terjadi kesalahan, silakan coba lagi.', timestamp},
      ])
      if (type === 'id') {
        setMessages((prev) => [
          ...prev,
          {sender: 'Mitra 10', message: 'Silakan isi Order ID Anda.', timestamp},
        ])
        setStep('orderId')
      }
    }
  }

  const resetChat = () => {
    setIsOpen(false)
    setStep('start')
    setMessage('')
    setMessages([])
    setOrderId('')
    setChatType('')
    setSearchQuery('')
    setGroupId('')
    setLoadingVendors(false)
    setNewMessages(false) // Reset new messages
    setUnreadCount(0) // Reset counter
  }

  const sendMessage = () => {
    // if (!message.trim()) return
    const timestamp = new Date()
    let msg = {
      groupId,
      organisasi: 'Mitra 10',
      sender:
        userRole === 'Owner Vendor'
          ? vendorName
          : userRole === 'Super User'
          ? 'Admin HO'
          : userRole === 'Store CS'
          ? storeName
          : userRole,
      timestamp,
      receiver: reciver,
      message,
    }

    if (typeof message === 'string') {
      msg.message = message

      socket.emit('sendMessage', msg)
    } else if (message.type === 'file') {
      // Handle upload file sebelum mengirim pesan
      const formData = new FormData()
      formData.append('file', message.file)

      axios
        .post(`${apiChat}/chat/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          msg.message = res.data.fileUrl // URL dari server setelah upload
          if (res.data.fileUrl) {
            socket.emit('sendMessage', msg)
          }
        })
        .catch((err) => {
          console.error('Upload gagal', err)
        })
    } else {
      return
    }
    // console.log(msg);

    // setMessages((prev) => [...prev, { sender: msg.sender, message: msg.message, timestamp: msg.timestamp }]); // Update local state with the new message
    setMessage('')
  }

  const fetchPreviousChats = async () => {
    try {
      const role =
        userRole === 'Admin HO'
          ? userRole
          : userRole === 'Super User'
          ? 'Admin HO'
          : userRole === 'Store CS'
          ? storeName
          : vendorName
      const res = await axios.get(`${apiChat}/chat/previousChats/${role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (res.status === 200) {
        setPreviousChats(res.data.groups)
      }
    } catch (err) {
      console.error(err)
      alert('Gagal memuat chat sebelumnya.')
    }
  }

  const handlePreviousChat = async (groupId: any) => {
    setGroupId(groupId)
    setSteps('riwayatChat')
    socket.emit('joinGroup', groupId)

    try {
      const res = await axios.get(`${apiChat}/chat/messages/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (res.status === 200) {
        setMessages(res.data)

        // Kurangi counter berdasarkan jumlah pesan yang dibaca dari grup ini
        const readCount = res.data.filter((msg: any) => {
          const currentUser =
            userRole === 'Owner Vendor'
              ? vendorName
              : userRole === 'Super User'
              ? 'Admin HO'
              : userRole === 'Store CS'
              ? storeName
              : userRole

          return msg.receiver?.some(
            (receiver: any) => receiver.user === currentUser && !receiver.read
          )
        }).length

        setUnreadCount((prev) => Math.max(0, prev - readCount))

        // IMPORTANT: Jangan ubah step jika sudah di 'previous'
        // Biarkan ChatPrevious component handle sendiri tampilan chat di kanan
        if (step !== 'previous') {
          setStep('chat') // Hanya ubah step jika dari auto-redirect
        }

        // Update read status di backend
        const currentUser =
          userRole === 'Owner Vendor'
            ? vendorName
            : userRole === 'Super User'
            ? 'Admin HO'
            : userRole === 'Store CS'
            ? storeName
            : userRole

        try {
          await axios.put(
            `${apiChat}/chat/status/${groupId}`,
            {sender: currentUser},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
        } catch (updateError) {
          console.error('Failed to update read status:', updateError)
        }
      } else {
        alert('Gagal mengambil pesan grup.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat mengambil pesan grup.')
    }
    setUnreadChats((prev: any) => prev.filter((id: any) => id !== groupId))
  }

  const handleDeleteChat = (id: any) => {
    Swal.fire({
      title: 'Kamu Yakin Menghapus Chat ini?',
      text: 'Data Chat Akan Terhapus Selamanya!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.delete(`${apiChat}/chat/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (res.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          })
          fetchPreviousChats()
        }
      }
    })
  }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [messageToEdit, setMessageToEdit] = useState<string>('')
  const [messageIndexToEdit, setMessageIndexToEdit] = useState<number | null>(null)

  const handleEditMessage = () => {
    // setMessageToEdit(messages[index].message);
    // setMessageIndexToEdit(index);
    setIsEditModalOpen(true)
  }

  const handleSaveEditedMessage = async (newMessage: string) => {
    const res = await axios.post(
      `${apiChat}/chat/organisasi/`,
      {
        id: organisasiId,
        deskripsi: newMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    resetChat()
  }

  const fetchNewChats = async () => {
    try {
      const res = await axios.get(`${apiChat}/chat/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (res.data && res.data.length > 0) {
        let unreadCounter = 0

        res.data.forEach((chat: any) => {
          let currentUser: string

          switch (userRole) {
            case 'Owner Vendor':
              currentUser = vendorName
              break
            case 'Super User':
              currentUser = 'Admin HO'
              break
            case 'Store CS':
              currentUser = storeName
              break
            default:
              currentUser = userRole
          }

          // Hitung jumlah pesan yang belum dibaca untuk user ini
          const unreadForUser = chat.receiver.filter(
            (receiver: any) => receiver.user === currentUser && !receiver.read
          ).length

          unreadCounter += unreadForUser
        })

        if (unreadCounter > 0) {
          setNewMessages(true)
          setUnreadCount(unreadCounter)
        } else {
          setNewMessages(false)
          setUnreadCount(0)
        }
      } else {
        setNewMessages(false)
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
  useEffect(() => {
    fetchNewChats()
  }, [])
  const NotificationBadge = ({count}: {count: number}) => {
    if (count === 0) return null

    return (
      <span
        style={{
          position: 'absolute',
          top: '-5px',
          right: '-2px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: count > 99 ? '3px 6px' : '5px',
          minWidth: '20px',
          height: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: count > 99 ? '10px' : '12px',
          zIndex: 999,
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          fontWeight: 'bold',
        }}
      >
        {count > 99 ? '99+' : count}
      </span>
    )
  }

  const debugExistingGroups = async () => {
    try {
      const currentUser =
        userRole === 'Owner Vendor'
          ? vendorName
          : userRole === 'Super User'
          ? 'Admin HO'
          : userRole === 'Store CS'
          ? storeName
          : userRole

      const res = await axios.get(`${apiChat}/chat/groups/member/${currentUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      console.log("User's existing groups:", res.data.groups)
      return res.data.groups
    } catch (error) {
      console.error('Error fetching user groups:', error)
      return []
    }
  }
  const debugSearchGroups = async (members: string[]) => {
    try {
      const memberString = members.join(',')
      const res = await axios.get(
        `${apiChat}/chat/groups/search?members=${encodeURIComponent(memberString)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      console.log(`Groups with members [${memberString}]:`, res.data.groups)
      return res.data.groups
    } catch (error) {
      console.error('Error searching groups:', error)
      return []
    }
  }

  const handleChatError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error)

    const timestamp = new Date()
    setMessages((prev) => [
      ...prev,
      {
        sender: 'Mitra 10',
        message: `Terjadi kesalahan saat ${context}. Silakan coba lagi.`,
        timestamp,
      },
    ])
  }
  return (
    <div>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {isOpen === false && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {/* Ganti badge lama dengan NotificationBadge component */}
            <NotificationBadge count={unreadCount} />

            <Button
              onClick={() => {
                if (isOpen) {
                  resetChat()
                } else {
                  if (newMessages) {
                    setIsOpen(true)
                    handleChatTypeSelection('previous')
                    setNewMessages(false)
                    // Jangan reset unreadCount di sini, biarkan reset ketika chat benar-benar dibaca
                  } else {
                    setIsOpen(true)
                  }
                }
              }}
              style={{
                padding: '10px',
                backgroundColor: isOpen ? 'transparent' : '#0F4CFF',
                color: isOpen ? 'black' : 'white',
                borderRadius: isOpen ? '0' : '20px',
                border: isOpen ? 'none' : 'none',
                cursor: 'pointer',
                boxShadow: isOpen ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.2)',
                fontSize: '15px',
                position: 'relative',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon icon={faComment} size='lg' className='text-white mx-1' />
              <span className='mx-1'>Live Chat</span>
            </Button>
          </div>
        )}

        {isOpen && (
          <div
            style={{
              width: step === 'previous' ? '900px' : '300px',
              height: '550px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                padding: '10px',
                backgroundColor: '#020080',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                display: 'flex', // Untuk membuat layout fleksibel
                alignItems: 'center',
                justifyContent: 'space-between', // Memberi ruang antara ikon dan judul
                position: 'relative', // Dibutuhkan untuk dropdown
              }}
            >
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {step !== 'start' && (
                  <button
                    onClick={() => {
                      setStep('start')
                      setSteps('')
                      datasss()
                      setOrderId('')
                      setChatType('')
                      setGroupId('')
                      setLoadingVendors(false)
                      setSearchQuery('')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <i
                      className='bi bi-arrow-left'
                      style={{marginRight: '8px', color: 'white', fontSize: '24px'}}
                    ></i>{' '}
                    {/* Icon Kembali */}
                  </button>
                )}
                <div
                  style={{
                    width: '50px', // Ukuran lingkaran
                    height: '50px', // Ukuran lingkaran
                    borderRadius: '50%', // Membuat area berbentuk lingkaran
                    overflow: 'hidden', // Memastikan gambar hanya terlihat dalam lingkaran
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    alt='Logo'
                    className='logo'
                    src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain', // Menyesuaikan gambar agar tidak terpotong
                    }}
                  />
                </div>

                <span
                  style={{
                    flex: 1,
                    textAlign: step !== 'start' ? 'center' : 'left',
                    marginLeft: 20,
                    fontSize: 16,
                  }}
                >
                  Layanan Live Chat
                </span>
              </div>
              {/* Tombol Titik Tiga */}
              <div style={{position: 'relative'}}>
                <button
                  onClick={resetChat} // Toggle menu
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                  }}
                >
                  <i className='bi bi-chevron-down fs-1'></i>
                </button>
              </div>
            </div>
            {step !== 'previous' && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                }}
                // Add reference to the container
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      textAlign:
                        msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                        msg.sender === vendorName ||
                        msg.sender === storeName
                          ? 'right'
                          : 'left',
                      marginBottom: '10px', // Jarak antar pesan
                    }}
                  >
                    {/* Nama pengirim */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#999', // Warna teks abu-abu
                        marginBottom: '5px', // Jarak nama ke kotak pesan
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
                            ? '#e0f7fa'
                            : '#f1f1f1', // Warna kotak pesan
                        color:
                          msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                          msg.sender === vendorName
                            ? '#333'
                            : '#333', // Warna teks
                        padding: '10px',
                        borderRadius: '8px', // Membuat kotak jadi rounded
                        maxWidth: '60%', // Maksimal lebar pesan
                        wordBreak: 'break-word', // Memastikan teks panjang tidak melampaui kotak
                      }}
                    >
                      {msg.message.startsWith('http') && msg.message.includes('/uploads/') ? (
                        msg.message.match(/\.(jpeg|jpg|png|gif)$/) ? (
                          <img
                            src={msg.message}
                            alt='Uploaded File'
                            style={{maxWidth: '100%', borderRadius: '5px'}}
                            onClick={() => setPreviewImage(msg.message)}
                          />
                        ) : msg.message.match(/\.(mp4|mov|avi)$/) ? (
                          <video controls style={{maxWidth: '100%', borderRadius: '5px'}}>
                            <source src={msg.message} type='video/mp4' />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <a href={msg.message} target='_blank' rel='noopener noreferrer'>
                            {msg.message}
                          </a>
                        )
                      ) : (
                        msg.message
                      )}
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(92, 92, 92, 0.7)',
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
                    {previewImage && (
                      <Modal show={!!previewImage} onHide={() => setPreviewImage('')} centered>
                        <Modal.Body>
                          <img src={previewImage} alt='Preview' style={{width: '100%'}} />
                        </Modal.Body>
                      </Modal>
                    )}
                  </div>
                ))}
              </div>
            )}
            {step === 'start' && (
              <ChatStart
                handleChatTypeSelection={handleChatTypeSelection}
                userRole={userRole}
                handleEditMessage={handleEditMessage}
              />
            )}
            {step === 'previous' && (
              <ChatPrevious
                vendorName={vendorName}
                setMessage={setMessage}
                sendMessage={sendMessage}
                setReciver={setReciver}
                messages={messages}
                message={message}
                previousChats={previousChats}
                handlePreviousChat={handlePreviousChat}
                handleDeleteChat={handleDeleteChat}
                unreadChats={unreadChats}
                userRole={userRole}
                fetchNewChats={fetchNewChats}
                storeName={storeName}
                groupId={groupId} // NEW: pass groupId
                steps={steps} // NEW: pass steps
              />
            )}
            {step === 'vendor' && (
              <ChatVendor
                vendorList={vendorList}
                StoreList={StoreList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loadingVendors={loadingVendors}
                startChat={startChat}
                chatType={chatType}
                vendorListRef={vendorListRef}
                handleScroll={handleScroll}
              />
            )}
            {step === 'orderId' && (
              <ChatOrderId orderId={orderId} setOrderId={setOrderId} startChat={startChat} />
            )}
            {step === 'chat' && (
              <ChatActive
                messages={messages}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            )}
            <EditMessageModal
              isOpen={isEditModalOpen}
              message={messageToEdit}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveEditedMessage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
