import React, {FC, useState, useEffect} from 'react'

import './DetailTukang.css'

import axios from 'axios'
import {Rate} from 'antd'
import {useParams} from 'react-router-dom'
import {Form, Row, Col, Button} from 'react-bootstrap'

const DetailTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [tukangDetail, setTukangDetail] = useState<any>()

  const fetchTukangDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/tukang/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.data
          setTukangDetail(data)
        })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTukangDetail()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-tukang'>
      <div className='row'>
        <div className='content-top d-flex'>
          <div className='col-3'>
            <i className='bi bi-person-circle'></i>
          </div>
          <div className='col-9'>
            <div className='box'>
              <h1>{tukangDetail?.full_name}</h1>
              <p>TUKANG</p>
              <small>rating</small>
              <div className='star-rating'>
                <Rate className='mt-2' disabled defaultValue={tukangDetail?.rating} />
              </div>
            </div>
          </div>
        </div>
        <div className='content-bottom'>
          <div className='col-3'>
            <div className='box'>
              <div className='title'>
                <h4>Keahlian</h4>
              </div>
              <ul>
                <li>Pasar Genteng</li>
                <li>Pengecatan</li>
                <li>Pasang Keramik</li>
                <li>Pasang Fikstur</li>
              </ul>
            </div>
          </div>
          <div className='col-9'>
            <div className='tab'>
              <div className='tab-title'>
                <div className='title'>
                  <i className='bi bi-person-fill'></i>
                  <p>About</p>
                </div>
              </div>
              <div className='data-diri'>
                <div className='data'>
                  <tr>
                    <td className='left'>Address : </td>
                    <td className='right'>{tukangDetail?.address}</td>
                  </tr>
                  <tr>
                    <td className='left'>Phone : </td>
                    <td className='right'>{tukangDetail?.phone_number}</td>
                  </tr>
                  <tr>
                    <td className='left'>Email : </td>
                    <td className='right'>{tukangDetail?.email}</td>
                  </tr>
                </div>
              </div>
              <div className='basic-info'>
                <hr />
                <p>Basic Information</p>
                <div className='data'>
                  <tr>
                    <td>Tanggal Lahir : </td>
                    <td className='right'>
                      {tukangDetail ? formatDate(new Date(tukangDetail?.join_date)) : ''}
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Kontak Darurat: </td>
                    <td className='right'>Sapardi</td>
                  </tr> */}
                  <tr>
                    <td>Nomor Telepon : </td>
                    <td className='right'>{tukangDetail?.phone_number}</td>
                  </tr>
                  {/* <tr>
                    <td>Hubungan: </td>
                    <td className='right'>Ayah</td>
                  </tr> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailTukangVendor}
