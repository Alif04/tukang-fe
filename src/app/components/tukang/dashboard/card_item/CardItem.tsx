import React, {FC} from 'react'
import './CardItem.css'

type Props = {
  className: string
}

const CardItem: React.FC<Props> = ({className}) => {
  return (
    <section id='card-item'>
      <div className='d-flex justify-content-between'>
        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Order in</h1>
            <h1 className='content-item text-success'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Quotation sent</h1>
            <h1 className='content-item text-warning'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Order cancel</h1>
            <h1 className='content-item text-danger'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Order survey</h1>
            <h1 className='content-item text-warning'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Work in Progress</h1>
            <h1 className='content-item text-warning'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Work done</h1>
            <h1 className='content-item text-success'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Complaint</h1>
            <h1 className='content-item text-danger'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Complaint resolve</h1>
            <h1 className='content-item text-success'>38</h1>
          </div>
        </div>

        <div className='card item'>
          <div className='card-body'>
            <h1 className='title'>Order Done</h1>
            <h1 className='content-item text-success'>38</h1>
          </div>
        </div>
      </div>
    </section>
  )
}

export {CardItem}
