/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Table from 'react-bootstrap/Table'

type Props = {
  className: string
}

const TableList: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-black mb-3'>List Pengaduan</h1>

          <Table hover className='mb-3'>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Complaint Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>9873488</td>
                <td>09/06/2023</td>
                <td>COMPLAINT</td>
              </tr>
              <tr>
                <td>8789372</td>
                <td>09/06/2023</td>
                <td>INVESTIGASI</td>
              </tr>
              <tr>
                <td>7673293</td>
                <td>09/06/2023</td>
                <td className='text-danger'>SELESAI</td>
              </tr>
              <tr>
                <td>9873488</td>
                <td>09/06/2023</td>
                <td>REWORK</td>
              </tr>
              <tr>
                <td>7673293</td>
                <td>09/06/2023</td>
                <td>REFUND</td>
              </tr>
              <tr>
                <td>7673293</td>
                <td>09/06/2023</td>
                <td>RESCHEDULE</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export {TableList}
