import React, {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailCostumers.css'

import {Rate} from 'antd'
import {Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLocationDot, faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons'

const DetailCostumerHO: FC = () => {
  return (
    <section id='detail-costumer'>
      <div className='card'>
        <div className='card-body'>
          <div className='row profile'>
            <div className='col-md-3'>
              <div className='profile-picture'>
                <img
                  className='d-block m-auto mb-4'
                  src={toAbsoluteUrl('/media/avatars/300-1.jpg')}
                  alt='Avatar'
                />
              </div>

              <div className='costumer-id'>
                <h3 className='text-center'>12198764</h3>
              </div>

              <div className='rating'>
                <Rate className='d-block m-auto' />
              </div>
            </div>

            <div className='col-md-6 profile-description'>
              <div className='full-name'>
                <h1>Chris Porter</h1>
              </div>

              <div className='information'>
                <div className='address d-flex mt-5 mb-5'>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size='xl'
                    color='#999999'
                    className='me-3'
                  />

                  <div className='address-detail'>
                    <span>DKI Jakarta, Indonesia</span>
                    <pre>Rs. Fatmawati No.39 12150 Jakarta Selatan Dki Jakarta </pre>
                  </div>
                </div>

                <div className='phone-number d-flex mt-5 mb-5'>
                  <FontAwesomeIcon icon={faPhone} size='xl' color='#484747' className='me-2' />
                  <h3>0865-765-8976</h3>
                </div>

                <div className='email-address d-flex mt-5 mb-5'>
                  <FontAwesomeIcon icon={faEnvelope} size='xl' color='#484747' className='me-2' />
                  <h3> lia.amalia@outlook.com</h3>
                </div>
              </div>

              <div className='button-group'>
                <Button variant='light-info' type='submit'>
                  Call
                </Button>

                <Button variant='light-dark' type='submit'>
                  Email
                </Button>
              </div>
            </div>

            <div className='col-md-3 purchase-information'>
              <div className='title'>
                <h1>Purchase Information</h1>
              </div>

              <ListGroup className='mt-5'>
                <ListGroup.Item>Item 1</ListGroup.Item>
                <ListGroup.Item>Item 2</ListGroup.Item>
                <ListGroup.Item>Item 3</ListGroup.Item>
                <ListGroup.Item>Item 4</ListGroup.Item>
                <ListGroup.Item>Item 5</ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailCostumerHO}
