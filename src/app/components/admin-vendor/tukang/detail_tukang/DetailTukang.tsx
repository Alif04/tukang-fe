import React, {FC} from 'react'
import {useState} from 'react'

import './DetailTukang.css'

import {Form, Row, Col, Button} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faSearch,
  faPlus,
  faImage,
  faFileImage,
} from '@fortawesome/free-solid-svg-icons'

const DetailTukangVendor: FC = () => {
  return (
    <section id='detail-tukang'>
      <div className='row'>
        <div className='content-top d-flex'>
          <div className='col-3'>
            <i className='bi bi-person-circle'></i>
          </div>
          <div className='col-9'>
            <div className='box'>
              <h1>Samito</h1>
              <p>TUKANG</p>
              <small>rating</small>
              <div className='star-rating'>
                <span>
                  <i className='bi bi-star-fill'></i>
                </span>
                <span>
                  <i className='bi bi-star-fill'></i>
                </span>
                <span>
                  <i className='bi bi-star-fill'></i>
                </span>
                <span>
                  <i className='bi bi-star-fill'></i>
                </span>
                <span>
                  <i className='bi bi-star'></i>
                </span>
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
                    <td className='left'>Address: </td>
                    <td className='right'>Jln.pahlawan 34</td>
                  </tr>
                  <tr>
                    <td className='left'>Phone: </td>
                    <td className='right'>0843-4378-2782</td>
                  </tr>
                  <tr>
                    <td className='left'>Email: </td>
                    <td className='right'>admin123@gmail.com</td>
                  </tr>
                </div>
              </div>
              <div className='basic-info'>
                <hr />
                <p>Basic Information</p>
                <div className='data'>
                  <tr>
                    <td>Tanggal Lahir: </td>
                    <td className='right'>18/6/2023</td>
                  </tr>
                  <tr>
                    <td>Kontak Darurat: </td>
                    <td className='right'>Sapardi</td>
                  </tr>
                  <tr>
                    <td>Nomor Telepon: </td>
                    <td className='right'>021920129102</td>
                  </tr>
                  <tr>
                    <td>Hubungan: </td>
                    <td className='right'>Ayah</td>
                  </tr>
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
