/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import axios from 'axios'
import Swal from 'sweetalert2'

type Props = {
  className: string
  storeData: any[]
  dateFrom: string
  dateTo: string
}

const TopBestStores: React.FC<Props> = ({className, storeData, dateFrom, dateTo}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const topFive = [...storeData]
  .sort((a, b) => (b.total_paid_value ?? 0) - (a.total_paid_value ?? 0))
  .slice(0, 5)


  const [loadingExport, setLoadingExport] = useState<boolean>(false)

  const checkDateFrom = dateFrom ? `&order_date_from=${dateFrom}` : ''
  const checkDateTo = dateTo ? `&order_date_to=${dateTo}` : ''

  // Export To Excel
  const exportToExcel = () => {
    if (storeData.length === 0) {
      Swal.fire('Warning', 'Belum ada data yang dapat di export', 'warning')
      return
    }

    setLoadingExport(true)

    axios
      .get(`${apiUrl}/store/export-excel?top_best=1${checkDateFrom}${checkDateTo}`, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
          'download',
          `Data Toko Terbaik ${
            dateFrom && dateTo ? 'Periode ' + dateFrom + ' - ' + dateTo : ''
          }.xlsx`
        )
        document.body.appendChild(link)
        link.click()

        setLoadingExport(false)
      })
      .catch((error: any) => {
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
        setLoadingExport(false)
      })
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-header d-flex justify-content-between py-5'>
        <h3 className='card-title fw-bold text-dark'>Top 5 Best Stores</h3>

        <button className='button-export' onClick={exportToExcel}>
          <h3 className='fs-5 fw-semibold'>{loadingExport ? 'Exporting..' : 'Export To Excel'}</h3>
        </button>
      </div>

      <div className='card-body pt-2'>
        {topFive.map((item: any) => (
          <div className='list-item d-flex justify-content-between mb-7'>
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-50px me-5'>
                <img
                  src={toAbsoluteUrl('/media/avatars/blank.png')}
                  className='rounded-circle'
                  alt=''
                />
              </div>

              <div className='flex-grow-1 me-2'>
                <div className='text-dark fw-bold fs-6'>{item?.store_name}</div>
                <span className='text-muted d-block fw-semibold'>{item?.email}</span>
              </div>
            </div>

            <div className='d-flex flex-column justify-content-center align-items-end'>
              <span className='fw-normal text-black'>{`Paid Value : Rp. ${parseInt(
                item?.total_paid_value ?? 0
              ).toLocaleString('id')}`}</span>
              <span className='fw-normal text-dark'>{item?.total_order ?? 0} Order</span>
            </div>
          </div>
        ))}
      </div>

      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total Store : {storeData.length} Store</p>
      </div>
    </div>
  )
}

export {TopBestStores}
