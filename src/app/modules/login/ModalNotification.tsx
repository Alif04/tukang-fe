// ModalNotification.tsx
import React from 'react'
import {Modal, Button} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

interface ModalNotificationProps {
  onClose: () => void
}

const ModalNotification: React.FC<ModalNotificationProps> = ({onClose}) => {
  const handleClick = () => {
    window.open('https://instalasi.mitra10.com', '_blank')
  }

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pemberitahuan Penting</Modal.Title>
      </Modal.Header>

      <Modal.Body className='d-flex flex-column flex-root bg-white'>
        <div className='d-flex flex-column flex-center flex-column-fluid p-10'>
          <img
            src={toAbsoluteUrl('/media/tukangin/vector-mitra10.png')}
            alt='Mitra110 Vector'
            className='mw-100 mb-10 h-lg-150px'
          />
          <h1 className='fs-1 fw-bold mb-5'>Website Khusus Training</h1>
          <h1 className='fs-5 fw-normal text-center mb-10'>
            Website ini dibuat khusus untuk keperluan training toko. Klik tombol di bawah ini jika
            ingin pergi ke Website Instalasi.
          </h1>
          <Button onClick={handleClick} variant='primary' className='btn btn-primary'>
            Silahkan klik link disini
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalNotification
