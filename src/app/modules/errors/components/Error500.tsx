import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'

const Error500: FC = () => {
  return (
    <div className='d-flex flex-column flex-root bg-white'>
      <div className='d-flex flex-column flex-center flex-column-fluid p-10'>
        <img
          src={toAbsoluteUrl('/media/tukangin/vector-mitra10.png')}
          alt='Mitra110 Vector'
          className='mw-100 mb-10 h-lg-150px'
        />

        <h1 className='fs-1 fw-bold mb-5'>Maaf, data order tidak ditemukan</h1>
        <h1 className='fs-5 fw-normal mb-10'>Silahkan konfirmasi kembali data order anda</h1>
      </div>
    </div>
  )
}

export {Error500}
