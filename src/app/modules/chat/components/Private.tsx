/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {ChatInner} from '../../../../_metronic/partials'
import axios from 'axios'
import Swal from 'sweetalert2'
import io from 'socket.io-client'
const apiUrl = process.env.REACT_APP_API_URL
const apiChat = process.env.REACT_APP_API_CHAT_URL
const socket = io(`${process.env.REACT_APP_API_CHAT_URL}/whatsapp`)
const Private: FC = () => {
  const [selectedTab, setSelectedTab] = useState('Assigned')
  const [showPopup, setShowPopup] = useState(false)
  const [selectedChats, setSelectedChats] = useState(null)
  const [chatData, setChatData] = useState(null)

  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [roles, setRoles] = useState<any>([])
  const tabs = ['Assigned', 'Unassigned', 'Resolved']
  const [data, setData] = useState<any>([])
  const [qrCode, setQrCode] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const userRole = localStorage.getItem('userRole') as string
  const fetchNewChat = async () => {
    let query = `status=${selectedTab}`
    if (selectedTab === 'Assigned' ||selectedTab === 'Resolved') {
      query += `&user=${userRole}`
    }
    try {
      const res = await axios.get(`${apiChat}/all-chat-assign?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (res.data) {
        setData(res.data.chats)
        //  console.log(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
  const getRoleList = async () => {
    let apiUrlWithParams = `${apiUrl}/roles`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (response.data) {
        const adminWARoles = response.data.data.data.filter((role: any) =>
          role.name.includes('Admin WA')
        )
        setRoles(adminWARoles)
      }
      // console.log(response.data.data.data);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchNewChat()
    getRoleList()
  }, [selectedTab])

  useEffect(() => {
    socket.on('qrCode', (data: any) => {
      setQrCode(data.qr)
    })

    socket.on('status', (data: any) => {
      if (data.status === 'isLogged' || data.status === 'successChat') {
        setIsConnected(true)
        setQrCode('')
      } else if (data.status === 'disconnected') {
        setIsConnected(false)
        requestQrCode()
      } else if (data.status === 'desconnectedMobile') {
        setIsConnected(false)
        requestQrCode()
      }
      console.log('Status bot:', data.status)
    })

    return () => {
      socket.off('qrCode')
      socket.off('status')
    }
  }, [])
  const requestQrCode = () => {
    socket.emit('requestQr')
  }

  const checkStatus = () => {
    socket.emit('checkStatus')
  }

  const handleAssignClick = (chatId: any) => {
    setSelectedChat(chatId)
    setShowPopup(true)
  }

  const handleAssignAdmin = (admin: any) => {
    setSelectedAdmin(admin.name)
    // setShowPopup(false)
  }

  const saveAssign = async () => {
    const data = {
      chatId: selectedChat,
      admin: selectedAdmin,
    }
    await axios
      .post(`${apiChat}/assign-chat`, data)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: 'Success',
            text: 'Berhasil menambahkan assign admin',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload()
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }
      })
      .catch((error) => {
        console.error(error)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const handleChatClick = async (chatId: any) => {
    setSelectedChats(chatId)

    try {
      const response = await fetch(`${apiChat}/get-assigned-admin?chatId=${chatId}`)
      const data = await response.json()

      if (data.success) {
        setChatData(data.data)
      } else {
        console.error('Gagal mengambil data chat:', data.error)
      }
    } catch (error) {
      console.error('Error fetching chat data:', error)
    }
  }
  const handleResolveChat = async () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda ingin mengakhiri percakapan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, akhiri!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${apiChat}/end-chat`, {chatId: selectedChats, admin: userRole})
          Swal.fire('Selesai!', 'Percakapan telah diakhiri.', 'success')
          setSelectedChats(null)
          setChatData(null)
          fetchNewChat()
        } catch (error) {
          console.error('Error resolving chat:', error)
          Swal.fire('Error', 'Gagal mengakhiri percakapan.', 'error')
        }
      }
    })
  }

  return (
    <div className='d-flex flex-column flex-lg-row'>
      {!isConnected && qrCode ? (
        <>
          <div className='text-center'>
            <h1>Scan QR Code WhatsApp</h1>
            <img src={qrCode} alt='QR Code' className='my-3' />
            <br />
            <button onClick={checkStatus} className='btn btn-primary'>
              Minta QR Baru
            </button>
          </div>
        </>
      ) : (
        <>
          {' '}
          <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
            <div className='card card-flush'>
              <div className='card-header pt-7' id='kt_chat_contacts_header'>
                {/* <form className='w-100 position-relative' autoComplete='off'>
                  <KTSVG
                    path='/media/icons/duotune/general/gen021.svg'
                    className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y'
                  />

                  <input
                    type='text'
                    className='form-control form-control-solid px-15'
                    name='search'
                    placeholder='Search by username or email...'
                  />
                </form> */}
              </div>

              <div className='card-body pt-5' id='kt_chat_contacts_body'>
                <div
                  className='scroll-y me-n5 pe-5 h-200px h-lg-auto'
                  data-kt-scroll='true'
                  data-kt-scroll-activate='{default: false, lg: true}'
                  data-kt-scroll-max-height='auto'
                  data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                  data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                  data-kt-scroll-offset='0px'
                >
                  <div
                    className='flex border-b mb-4'
                    style={{justifyContent: 'space-between', display: 'flex'}}
                  >
                    {tabs.map((tab) => (
                      <div
                        key={tab}
                        className={`p-2 cursor-pointer flex-1 text-center ${
                          selectedTab === tab
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-500'
                        }`}
                        onClick={() => {
                          setSelectedTab(tab)
                          setChatData(null)
                          setSelectedChats(null)
                        }}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                  {selectedTab === 'Assigned' && (
                    <>
                      {data.map((a: any, i: any) => {
                        return (
                          <div
                            key={i}
                            className='d-flex align-items-center'
                            style={{
                              position: 'relative',
                              marginBottom: '10px',
                            }}
                          >
                            <div className='symbol symbol-45px symbol-circle'>
                              <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'></span>
                            </div>
                            <button
                              onClick={() => handleChatClick(a.chatId)}
                              style={{
                                marginLeft:4,
                                width: '100%',
                                padding: '15px',
                                backgroundColor:
                                  selectedChats === a.chatId ? '#1f70f2' : 'transparent',
                                color: selectedChats === a.chatId ? 'white' : 'inherit',
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
                              <span style={{color: '#333', fontWeight: '500'}}>{a.chatId}</span>
                            </button>
                          </div>
                        )
                      })}
                    </>
                  )}

                  {selectedTab === 'Unassigned' && (
                    <>
                      {data.map((a: any, i: any) => {
                        return (
                          <div key={i}>
                            <div className='d-flex flex-stack py-4'>
                              <div className='d-flex align-items-center'>
                                <div className='symbol symbol-45px symbol-circle'>
                                  <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'></span>
                                </div>

                                <div className='ms-5'>
                                  <button
                                    style={{
                                      width: '100%',
                                      padding: '15px',
                                      backgroundColor: 'transparent',
                                      color: 'inherit',
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
                                    <span style={{color: '#333', fontWeight: '500'}}>
                                      {a.chatId}
                                    </span>
                                  </button>
                                  {/* <div className='fw-bold text-gray-400'>melody@altbox.com</div> */}
                                </div>
                              </div>

                              <div className='d-flex flex-column align-items-end ms-2'>
                                <button
                                  className='btn btn-sm btn-icon btn-active-light-primary'
                                  onClick={() => handleAssignClick(a.chatId)}
                                >
                                  <i className='bi bi-three-dots fs-2'></i>
                                </button>
                              </div>
                            </div>

                            <div className='separator separator-dashed d-none'></div>
                          </div>
                        )
                      })}
                    </>
                  )}
                  {selectedTab === 'Resolved' && (
                    <>
                      {data.map((a: any, i: any) => {
                        return (
                          <div key={i}>
                            <div className='d-flex flex-stack py-4'>
                              <div className='d-flex align-items-center'>
                                <div className='symbol symbol-45px symbol-circle'>
                                  <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'></span>
                                </div>

                                <div className='ms-5'>
                                  <button
                                    style={{
                                      width: '100%',
                                      padding: '15px',
                                      backgroundColor: 'transparent',
                                      color: 'inherit',
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
                                    <span style={{color: '#333', fontWeight: '500'}}>
                                      {a.chatId}
                                    </span>
                                  </button>
                                  {/* <div className='fw-bold text-gray-400'>melody@altbox.com</div> */}
                                </div>
                              </div>

                              <div className='d-flex flex-column align-items-end ms-2'>
                                {/* <span className='text-muted fs-7 mb-1'>5 hrs</span> */}
                              </div>
                            </div>

                            <div className='separator separator-dashed d-none'></div>
                          </div>
                        )
                      })}
                    </>
                  )}
                  {showPopup && (
                    <div className='modal show d-block' tabIndex={1}>
                      <div className='modal-dialog'>
                        <div className='modal-content'>
                          <div className='modal-header'>
                            <h5 className='modal-title'>Pilih Admin</h5>
                            <button
                              type='button'
                              className='btn-close'
                              onClick={() => setShowPopup(false)}
                            ></button>
                          </div>
                          <div className='modal-body'>
                            <select
                              className='form-select'
                              onChange={(e) => {
                                const selectedRole = roles.find(
                                  (role: any) => role.name === e.target.value
                                )

                                if (selectedRole) {
                                  handleAssignAdmin(selectedRole)
                                }
                              }}
                            >
                              <option value=''>Pilih Admin</option>
                              {roles.map((role: any) => (
                                <option key={role._id} value={role._id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button onClick={saveAssign}>Simpan</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {selectedChats && chatData && (
            <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
              <div className='card' id='kt_chat_messenger'>
                <div className='card-header' id='kt_chat_messenger_header'>
                  <div className='card-title'>
                    <div className='symbol-group symbol-hover'></div>
                    <div className='d-flex justify-content-center flex-column me-3'>
                      <div className='mb-0 lh-1'></div>
                    </div>
                  </div>

                  <div className='card-toolbar'>
                    <div className='me-n3'>
                      <button
                        className='btn btn-sm btn-icon btn-active-light-primary'
                        onClick={handleResolveChat}
                        style={{
                          marginRight: 30,
                        }}
                      >
                        <i className='bi bi-check'>Resolved</i>
                      </button>
                    </div>
                  </div>
                </div>
                <ChatInner chatData={chatData} selectedChats={selectedChats} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export {Private}
