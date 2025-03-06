/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import clsx from 'clsx'
import {FC, useEffect, useRef, useState} from 'react'
import { Modal } from 'react-bootstrap'
import io from 'socket.io-client'

type Props = {
  isDrawer?: boolean
  chatData: any
  selectedChats: any
}
const socket = io(`${process.env.REACT_APP_API_CHAT_URL}/whatsapp`)
const ChatInner: FC<Props> = ({isDrawer = false, chatData, selectedChats}) => {
  const [message, setMessage] = useState<string>('')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [chatDatas, setChatDatas] = useState<any[]>(chatData)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewImage, setPreviewImage] = useState(null)
  const chatContainerRef = useRef<any>(null);
  const [previewImages, setPreviewImages] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null) // State untuk gambar
  const handleFileClick = () => {
    fileInputRef.current?.click()
  }
  const getRoleList = async () => {
    let apiUrlWithParams = `${apiChat}/templates`

    try {
      const response = await axios.get(apiUrlWithParams)
      if (response.data) {
        setTemplates(response.data)
      }
      // console.log(response.data.data.data);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    getRoleList()
  }, [])

  useEffect(() => {
    setChatDatas(chatData)
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatData])
  const apiChat = process.env.REACT_APP_API_CHAT_URL
  const userRole = localStorage.getItem('userRole') as string
  const sendMessage = async () => {
    const data = {
      message: message,
      chatId: selectedChats,
      adminRole: userRole,
    }
    setMessage('')
    await axios
      .post(`${apiChat}/send-message`, data)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error)

        // Swal.fire({
        //   title: 'Error',
        //   text: error.response.data.message,
        //   icon: 'error',
        // })
      })
  }

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      sendMessage()
    }
  }
  useEffect(() => {
    const handleReceiveMessage = (msg: {
      chatId: string
      message: string
      timestamp: string
      fromMe: boolean
      sender: string
    }) => {
      if (msg.chatId === selectedChats) {
        setChatDatas((prev) => [...prev, msg]) // Tambahkan pesan baru ke chatData
      }
    }

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [socket])

  const sendImage = async (file:any, caption = '') => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('chatId', selectedChats);
    formData.append('image', file);
    formData.append('caption', caption);
    formData.append('adminRole', userRole);
  
    try {
      await axios.post(`${apiChat}/send-image`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('');
      setPreviewImages(null);
      console.log('Gambar terkirim!');
    } catch (error) {
      console.error('Gagal mengirim gambar:', error);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // Buat URL sementara untuk preview gambar
    setImage(file)
    const imageUrl = URL.createObjectURL(file);
    setPreviewImages(imageUrl);
  };
  
  const sendPreviewImage = async () => {  
    await sendImage(image);
    setPreviewImage(null);
  };
  
  return (
    <>
      <div
            ref={chatContainerRef}
        className='card-body'
        id={isDrawer ? 'kt_drawer_chat_messenger_body' : 'kt_chat_messenger_body'}
        style={{
          maxHeight: '600px', // Batasi tinggi agar scroll muncul di dalam
          overflowY: 'auto', // Aktifkan scroll di dalam chat
        }}
      >
        <div
          // className={clsx('scroll-y me-n5 pe-5', {'h-300px h-lg-auto': !isDrawer})}
          data-kt-element='messages'
          // data-kt-scroll='true'
          // data-kt-scroll-activate='{default: false, lg: true}'
          // data-kt-scroll-max-height='auto'
          // data-kt-scroll-dependencies={
          //   isDrawer
          //     ? '#kt_drawer_chat_messenger_header, #kt_drawer_chat_messenger_footer'
          //     : '#kt_header, #kt_toolbar, #kt_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer'
          // }
          // data-kt-scroll-wrappers={
          //   isDrawer ? '#kt_drawer_chat_messenger_body' : '#kt_content, #kt_chat_messenger_body'
          // }
          // data-kt-scroll-offset={isDrawer ? '0px' : '-2px'}
        >
          {chatDatas.map((message: any, index: any) => {
            // const userInfo = userInfos[message.user]
            const state = message.fromMe === false ? 'info' : 'primary'
            // const templateAttr = {}
            // if (message.template) {
            //   Object.defineProperty(templateAttr, 'data-kt-element', {
            //     value: `template-${message.type}`,
            //   })
            // }
            const contentClass = `${isDrawer ? '' : 'd-flex'} justify-content-${
              message.fromMe === false ? 'start' : 'end'
            } mb-10`
            return (
              <div
                key={`message${index}`}
                className={clsx('d-flex', contentClass, 'mb-10', {'d-none': message.template})}
                // {...templateAttr}
              >
                <div
                  className={clsx(
                    'd-flex flex-column align-items',
                    `align-items-${message.fromMe === false ? 'start' : 'end'}`
                  )}
                >
                  <div className='d-flex align-items-center mb-2'>
                    {message.fromMe === false ? (
                      <>
                        <div className='symbol  symbol-35px symbol-circle '>
                          {/* <img alt='Pic' /> */}
                        </div>
                        <div className='ms-3'>
                          <a
                            href='#'
                            className='fs-5 fw-bolder text-gray-900 text-hover-primary me-1'
                          >
                            {message.sender}
                          </a>
                          <span className='text-muted fs-7 mb-1'>
                            {' '}
                            {new Date(message.timestamp).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='me-3'>
                          <span className='text-muted fs-7 mb-1'>
                            {' '}
                            {new Date(message.timestamp).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </span>
                          <a
                            href='#'
                            className='fs-5 fw-bolder text-gray-900 text-hover-primary ms-1'
                          >
                            {message.sender ==='Auto Responder'?userRole:message.sender}
                          </a>
                        </div>
                        <div className='symbol  symbol-35px symbol-circle '>
                          {/* <img alt='Pic' /> */}
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className={clsx(
                      'p-5 rounded',
                      `bg-light-${state}`,
                      'text-dark fw-bold mw-lg-400px',
                      `text-${message.fromMe ? 'end' : 'start'}`
                    )}
                    data-kt-element='message-text'
                  >
                    {message?.message?.startsWith('http') && message?.message?.includes('/uploads/') ? (
                    message?.message?.match(/\.(jpeg|jpg|png|gif)$/) ? (
                      <img
                        src={message.message}
                        alt='Uploaded File'
                        style={{maxWidth: '100%', borderRadius: '5px'}}
                        onClick={() => setPreviewImage(message.message)}
                      />
                    ) : message?.message?.match(/\.(mp4|mov|avi)$/) ? (
                      <video controls style={{maxWidth: '100%', borderRadius: '5px'}}>
                        <source src={message.message} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <a href={message.message} target='_blank' rel='noopener noreferrer'>
                        {message.message}
                      </a>
                    )
                  ) : (
                    <span dangerouslySetInnerHTML={{__html: message.message}}></span>
                  )}
                                      {/* <span dangerouslySetInnerHTML={{__html: message.message}}></span> */}
                         {previewImage && (
                  <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered>
                    <Modal.Body>
                      <img src={previewImage} alt='Preview' style={{width: '100%'}} />
                    </Modal.Body>
                  </Modal>
                )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
   
      <div
        className='card-footer pt-4'
        id={isDrawer ? 'kt_drawer_chat_messenger_footer' : 'kt_chat_messenger_footer'}
      >
           {previewImages ?  (
        <div className="d-flex align-items-center mb-3">
          <img
            src={previewImages}
            alt="Preview"
            style={{ maxWidth: '100px', borderRadius: '5px', marginRight: '10px' }}
          />
          <button className="btn btn-primary btn-sm" onClick={sendPreviewImage}>
            Kirim
          </button>
          <button className="btn btn-danger btn-sm ms-2" onClick={() => setPreviewImage(null)}>
            Batal
          </button>
        </div>
      )
    :
    <>
       <textarea
          className='form-control form-control-flush mb-3'
          rows={1}
          data-kt-element='input'
          placeholder='Type a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onEnterPress}
        ></textarea>

        <div className='d-flex flex-stack'>
          <div className='d-flex align-items-center me-2'>
            <button
              className='btn btn-sm btn-icon btn-active-light-primary me-1'
              type='button'
              data-bs-toggle='tooltip'
              title='Coming soon'
              onClick={handleFileClick}
            >
              <input
                type='file'
                accept='image/*'
                style={{display: 'none'}}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <i className='bi bi-paperclip fs-3'></i>
            </button>
            {/* <button
          className='btn btn-sm btn-icon btn-active-light-primary me-1'
          type='button'
          data-bs-toggle='tooltip'
          title='Coming soon'
        >
          <i className='bi bi-upload fs-3'></i>
        </button> */}
          </div>
          <div className='d-flex justify-content-between'>
            <button
              className='btn btn-secondary'
              onClick={() => setShowTemplateModal(true)}
              style={{marginRight: 10}}
            >
              Kirim template
            </button>
            <button
              className='btn btn-primary'
              type='button'
              data-kt-element='send'
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
          {/* <button className='btn btn-secondary' onClick={() => setShowTemplateModal(true)}>Kirim template</button>
          <button
            className='btn btn-primary'
            type='button'
            data-kt-element='send'
            onClick={sendMessage}
          >
            Send
          </button> */}
        </div></>
    
    }
     
        {showTemplateModal && (
          <div className='modal show d-block' style={{background: 'rgba(0, 0, 0, 0.5)'}}>
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>Pilih Template</h5>
                  <button
                    className='btn-close'
                    onClick={() => setShowTemplateModal(false)}
                  ></button>
                </div>
                <div className='modal-body'>
                  <select
                    className='form-select'
                    onChange={(e) => {
                      setMessage(e.target.value)
                      setShowTemplateModal(false)
                    }}
                  >
                    <option value=''>Pilih Template</option>
                    {templates.map((tpl, index) => (
                      <option key={index} value={tpl.content}>
                        {tpl.templateName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export {ChatInner}
