/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import ListComplaintData from '../../../../data/complaint/ViewComplaint'

import './ViewComplaint.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Table, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faFilter, faSearch, faTrash} from '@fortawesome/free-solid-svg-icons'

type Props = {
  className: string
}

const ViewComplaintStore: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const {RangePicker} = DatePicker

  const DateRange = () => {
    return <RangePicker className='date-range ms-3' />
  }

  interface DataType {
    complaint_id: number
    // assign_from: string
    // order_id: number
    // date_order: string
    // no_member: string
    // costumer_name: string
    // phone_number: number
    // installer_name: string
    // order_status: string
    // work_status: string
    complaint_date: string
    complaint_desc: string
    complaint_status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Complaint ID',
      dataIndex: 'complaint_id',
      key: 'complaint_id',
      align: 'center',
      // width: 90,
    },
    // {
    //   title: 'Assign From',
    //   dataIndex: 'assign_from',
    //   key: 'assign_from',
    //   align: 'center',
    //   width: 120,
    // },
    // {
    //   title: 'Order ID',
    //   dataIndex: 'order_id',
    //   key: 'order_id',
    //   align: 'center',
    //   width: 120,
    // },
    // {
    //   title: 'Order Date',
    //   dataIndex: 'date_order',
    //   key: 'date_order',
    //   align: 'center',
    //   width: 130,
    // },
    // {
    //   title: 'No Member',
    //   dataIndex: 'no_member',
    //   key: 'no_member',
    //   align: 'center',
    //   width: 130,
    // },
    // {
    //   title: 'Customer Name',
    //   dataIndex: 'costumer_name',
    //   key: 'costumer_name',
    //   width: 150,
    // },
    // {
    //   title: 'No Telp / WA',
    //   dataIndex: 'phone_number',
    //   key: 'phone_number',
    //   width: 160,
    // },
    // {
    //   title: 'Installer Name',
    //   dataIndex: 'installer_name',
    //   key: 'installer_name',
    //   width: 180,
    // },
    // {
    //   title: 'Order Status',
    //   dataIndex: 'order_status',
    //   key: 'order_status',
    //   width: 180,
    // },
    // {
    //   title: 'Work Status',
    //   dataIndex: 'work_status',
    //   key: 'work_status',
    //   className: 'col-work-status',
    //   width: 180,
    // },
    {
      title: 'Complaint Date',
      dataIndex: 'complaint_date',
      key: 'complaint_date',
      className: 'col-complaint-date',
      // width: 90,
    },
    {
      title: 'Complaint Description',
      dataIndex: 'complaint_desc',
      key: 'complaint_desc',
      className: 'col-complaint-date',
      // width: 110,
    },
    {
      title: 'Complaint Status',
      dataIndex: 'complaint_status',
      key: 'complaint_status',
      className: 'col-complaint-status',
      // width: 180,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleDetail = () => {
          const id = record.complaint_id
          navigate(`/complaint/detail-complaint/${id}`)
        }

        const handleDelete = () => {
          const id = record.complaint_id

          Swal.fire({
            title: 'Are you sure delete this complaint?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete Complaint',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                axios
                  .delete(`${apiUrl}/complaints/${id}`, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((res) => {
                    Swal.fire({
                      title: 'Success',
                      text: res.data.message,
                      icon: 'success',
                    })
                    window.location.reload()
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: error.response.data.message,
                icon: 'error',
              })
            })
        }

        return (
          <div className='button-wrapper'>
            <a className='button-detail' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-delete' onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      // width: 80,
    },
  ]

  // const data: DataType[] = [
  //   {
  //     key: '1',
  //     complaint_id: '78453992',
  //     assign_from: 'HO',
  //     order_id: '78453992',
  //     date_order: '10/2/2023',
  //     no_member: '78453992',
  //     costumer_name: 'Alia',
  //     phone_number: '08158374638',
  //     installer_name: 'Water Heater',
  //     order_status: 'New set up',
  //     work_status: 'DONE',
  //     complaint_date: '11/2/2023',
  //     umur_complaint: '24 jam',
  //     complaint_status: 'RECEIVED',
  //   },
  //   {
  //     key: '2',
  //     complaint_id: '78453992',
  //     assign_from: 'HO',
  //     order_id: '78453992',
  //     date_order: '12/2/2023',
  //     no_member: '78453992',
  //     costumer_name: 'Abdul',
  //     phone_number: '08158374638',
  //     installer_name: 'Water Heater',
  //     order_status: 'New set up',
  //     work_status: 'DONE',
  //     complaint_date: '11/2/2023',
  //     umur_complaint: '24 jam',
  //     complaint_status: 'RECEIVED',
  //   },
  //   {
  //     key: '3',
  //     complaint_id: '78453992',
  //     assign_from: 'HO',
  //     order_id: '78453992',
  //     date_order: '13/2/2023',
  //     no_member: '78453992',
  //     costumer_name: 'Ahmad',
  //     phone_number: '08158374638',
  //     installer_name: 'AC',
  //     order_status: 'New set up',
  //     work_status: 'DONE',
  //     complaint_date: '11/2/2023',
  //     umur_complaint: '24 jam',
  //     complaint_status: 'RECEIVED',
  //   },
  //   {
  //     key: '4',
  //     complaint_id: '78453992',
  //     assign_from: 'STORE',
  //     order_id: '78453992',
  //     date_order: '15/2/2023',
  //     no_member: '78453992',
  //     costumer_name: 'Jean',
  //     phone_number: '08158374638',
  //     installer_name: 'Ubin',
  //     order_status: 'New set up',
  //     work_status: 'DONE',
  //     complaint_date: '11/2/2023',
  //     umur_complaint: '24 jam',
  //     complaint_status: 'RECEIVED',
  //   },
  // ]

  // Fetch Data Complaint
  const [complaintData, setComplaintData] = useState<DataType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await ListComplaintData()
      setComplaintData(data)
    }

    fetchData()
  }, [])

  // Search Data Complaint
  const [searchValue, setSearch] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <section id='view-complaint'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
                <h3 className='fs-3 fw-normal'>Date : </h3>
              </div>

              <DateRange />
            </Col>

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder='Filter'
                    className='filter-ltr'
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={complaintData}
            rowKey={(record) => record.complaint_id}
            // scroll={{x: 1700}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewComplaintStore}
