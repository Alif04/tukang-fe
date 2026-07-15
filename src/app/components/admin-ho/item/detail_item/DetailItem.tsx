import React, {FC, useState, useEffect} from 'react'

import './DetailItem.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Table, Row, Col} from 'react-bootstrap'
import {formatDate} from '../../../../../_metronic/helpers'

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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
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

  return (
    <section id='detail-item'>
      <div className='card'>
        <div className='card-body'>
          <div className='title text-center'>
            <h1 className='fw-bolder'>DETAIL ITEM</h1>
          </div>

          <Row className='mt-5 mb-5'>
            <Col>
              <h3 className='pt-2 pb-2 fw-semibold'>
                Item ID : <span className='fw-normal'>{itemDetail?.id}</span>
              </h3>

              <h3 className='pt-2 pb-2 fw-semibold'>
                Item Code : <span className='fw-normal'>{itemDetail?.item_code}</span>
              </h3>

              <h3 className='pt-2 pb-2 fw-semibold'>
                Nama Material :
                <span className='ms-1 fw-normal'>{itemDetail?.item_name || '-'}</span>
              </h3>

              <h3 className='pt-2 pb-2 fw-semibold'>
                Nominal Kepada Vendor :
                <span className='ms-1 fw-normal'>{`Rp. ${parseInt(
                  itemDetail?.invoice_nominal ?? 0
                ).toLocaleString('id')}`}</span>
              </h3>
            </Col>

            <Col>
              <h3 className='pt-2 pb-2 fw-semibold'>
                Nama Jasa Pemasangan : <span className='fw-normal'>{itemDetail?.service_name}</span>
              </h3>

              <h3 className='pt-2 pb-2 fw-semibold'>
                Kategori : <span className='fw-normal'>{itemDetail?.category.category_name}</span>
              </h3>

              <h3 className='pt-2 pb-2 fw-semibold'>
                Harga Normal :{' '}
                <span className='fw-normal'>{`Rp. ${parseInt(
                  itemDetail?.default_price ? itemDetail?.default_price : 0
                ).toLocaleString('id')}`}</span>
              </h3>
            </Col>
          </Row>

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
                    <td style={{maxWidth: '200px'}}>{`${formatDate(
                      new Date(item?.periodic_start)
                    )} — ${formatDate(new Date(item?.periodic_end))}`}</td>

                    <td style={{maxWidth: '250px'}}>
                      {item?.price_stores
                        .map((storeDetail: any) => storeDetail?.store?.store_name ?? '-')
                        .join(', ')}
                    </td>

                    <td style={{maxWidth: '200px'}} className='text-center'>
                      {item?.min_order}
                    </td>

                    <td style={{width: '200px'}} className='text-center'>{`Rp. ${parseInt(
                      item?.price || 0
                    ).toLocaleString('id')}`}</td>
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
