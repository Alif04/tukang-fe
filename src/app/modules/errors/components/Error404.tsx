import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Button} from 'react-bootstrap'

const Error404: FC = () => {
  const handleClick = () => {
    window.open('https://instalasi.mitra10.com', '_blank')
  }

  return (
    <div className='d-flex flex-column flex-root bg-white'>
      <div className='d-flex flex-column flex-center flex-column-fluid p-10'>
        <img
          src={toAbsoluteUrl('/media/tukangin/vector-mitra10.png')}
          alt='Mitra110 Vector'
          className='mw-100 mb-10 h-lg-150px'
        />

        <h1 className='fs-1 fw-bold mb-5'>Maaf, Halaman Tidak Tersedia</h1>
        <h1 className='fs-5 fw-normal mb-10'>
          Halaman yang Anda cari telah pindah ke link yang baru. Klik tombol dibawah ini untuk
          menuju ke halaman yang benar.
        </h1>

        <Button onClick={() => handleClick()} variant='primary' className='btn btn-primary'>
          Silahkan klik link disini
        </Button>
      </div>
    </div>
  )
}

export {Error404}
