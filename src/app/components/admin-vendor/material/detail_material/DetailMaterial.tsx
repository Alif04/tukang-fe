import React, {FC, useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailMaterial.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Form, Table, Row, Col} from 'react-bootstrap'

const DetailMaterialVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [materialDetail, setMaterialDetail] = useState<any>()

  const getItemData = async () => {
    try {
      await axios
        .get(`${apiUrl}/items/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setMaterialDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getItemData()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-quotation'>
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
                  <h2 className='fw-semibold mb-2'>
                    {materialDetail?.prices[0]?.store?.store_name}
                  </h2>
                  <h3 className='fw-normal'>{materialDetail?.prices[0]?.store?.address}</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>MATERIAL</h1>

              <h3 className='fw-semibold'>
                Material ID :<span className='fw-normal'>{materialDetail?.id}</span>
              </h3>

              <h3 className='fw-semibold'>
                Nama Material :
                <span className='ms-1 fw-normal'>{materialDetail?.item_name ?? '-'}</span>
              </h3>

              <h3 className='fw-semibold'>
                Nama Jasa Pemasangan :{' '}
                <span className='fw-normal'>{materialDetail?.service_name}</span>
              </h3>

              <h3 className='fw-semibold'>
                Kategori : <span className='fw-normal'>{materialDetail?.category_id}</span>
              </h3>

              <h3 className='fw-semibold'>
                Harga Normal :{' '}
                <span className='fw-normal'>{`Rp. ${parseInt(
                  materialDetail?.default_price ? materialDetail?.default_price : 0
                )}`}</span>
              </h3>
            </div>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Item</th>
                  <th className='text-center'>Minimal Order</th>
                  <th className='text-center'>Periode Diskon</th>
                  <th className='text-center'>Harga Diskon</th>
                </tr>
              </thead>
              <tbody>
                {materialDetail?.prices.map((item: any) => (
                  <>
                    <tr>
                      <td>{item?.item_name ?? '-'}</td>
                      <td>{item?.min_order ?? 0}</td>
                      <td>{`${formatDate(new Date(item?.periodic_start))} - ${formatDate(
                        new Date(item?.periodic_end)
                      )}`}</td>
                      <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailMaterialVendor}
