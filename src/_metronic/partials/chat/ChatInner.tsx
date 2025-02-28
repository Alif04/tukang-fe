/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import io from 'socket.io-client'

type Props = {
  isDrawer?: boolean
  chatData: any
  selectedChats: any
}

const socket = io(`${process.env.REACT_APP_API_CHAT_URL}/whatsapp`)
const ChatInner: FC<Props> = ({isDrawer = false, chatData, selectedChats}) => {
  const [message, setMessage] = useState<string>('')

  const [chatDatas, setChatDatas] = useState<any[]>(chatData)
  // console.log(chatData);
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
      .post(`${apiChat}/send-message`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
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
    const handleReceiveMessage = (msg: { chatId: string; message: string; timestamp: string; fromMe: boolean; sender: string }) => {
      console.log(msg);
      
      if (msg.chatId === selectedChats) {
        setChatDatas((prev) => [...prev, msg]) // Tambahkan pesan baru ke chatData
      }
    }

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [selectedChats, socket])
  return (
    <>
      <div
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
                            {message.sender}
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
                      `text-${message.fromMe === false ? 'start' : 'end'}`
                    )}
                    data-kt-element='message-text'
                    dangerouslySetInnerHTML={{__html: message.message}}
                  ></div>
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
            {/* <button
          className='btn btn-sm btn-icon btn-active-light-primary me-1'
          type='button'
          data-bs-toggle='tooltip'
          title='Coming soon'
        >
          <i className='bi bi-paperclip fs-3'></i>
        </button>
        <button
          className='btn btn-sm btn-icon btn-active-light-primary me-1'
          type='button'
          data-bs-toggle='tooltip'
          title='Coming soon'
        >
          <i className='bi bi-upload fs-3'></i>
        </button> */}
          </div>
          <button
            className='btn btn-primary'
            type='button'
            data-kt-element='send'
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}

export { ChatInner }

