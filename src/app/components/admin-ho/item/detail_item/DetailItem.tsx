import React, {FC, useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailItem.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Form, Table, Row, Col} from 'react-bootstrap'

const DetailItemHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [itemDetail, setItemDetail] = useState<any>()

  const getItemData = async () => {
    try {
      await axios
        .get(`${apiUrl}/items/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setItemDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getItemData()
  }, [])

  const formatDate = (date: any) => {
    const day = date.toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  return (
    <section id='detail-item'>
      <div className='card'>
        <div className='card-body'>
          <div className='invoice-detail d-flex justify-content-between'>
            <div className='vendor-information'>
              <div className='vendor-detail'>
                <img
                  alt='Logo'
                  className='h-50px logo mb-3'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <div className='address'>
                  <h2 className='fw-semibold mb-2'>{itemDetail?.prices[0]?.store?.store_name}</h2>
                  <h3 className='fw-normal'>{itemDetail?.prices[0]?.store?.address}</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>ITEM</h1>

              <h3 className='fw-semibold'>
                Item ID : <span className='fw-normal'>{itemDetail?.id}</span>
              </h3>

              <h3 className='fw-semibold'>
                Nama Material :
                <span className='ms-1 fw-normal'>{itemDetail?.item_name || '-'}</span>
              </h3>

              <h3 className='fw-semibold'>
                Nama Jasa Pemasangan : <span className='fw-normal'>{itemDetail?.service_name}</span>
              </h3>

              <h3 className='fw-semibold'>
                Kategori : <span className='fw-normal'>{itemDetail?.category.category_name}</span>
              </h3>

              <h3 className='fw-semibold'>
                Harga Normal :{' '}
                <span className='fw-normal'>{`Rp. ${parseInt(
                  itemDetail?.default_price ? itemDetail?.default_price : 0
                ).toLocaleString('id')}`}</span>
              </h3>
            </div>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Periode</th>
                  <th className='text-center'>Assign To Store</th>
                  <th className='text-center'>Minimum Order</th>
                  <th className='text-center'>Price</th>
                </tr>
              </thead>
              <tbody>
                {itemDetail?.prices.map((item: any, index: number) => (
                  <tr key={`price-${index}`}>
                    <td>{`${formatDateTime(new Date(item?.periodic_start))} — ${formatDateTime(
                      new Date(item?.periodic_end)
                    )}`}</td>
                    <td>
                      {item?.price_stores
                        .map((storeDetail: any) => storeDetail?.store?.store_name ?? '-')
                        .join(', ')}
                    </td>
                    <td className='text-center'>{item?.min_order}</td>
                    <td>{`Rp. ${parseInt(item?.price || 0).toLocaleString('id')}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailItemHO}
