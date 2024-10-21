import React, {FC, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'

import './DetailRequestIncentive.css'

import axios from 'axios'
import {Image} from 'antd'
import {Modal, ListGroup, Table, Row, Col, Card, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {formatDate, formatDateWithTime} from '../../../../../_metronic/helpers'

interface Store {
  store_id: number
  store_name: string
  address: string
  phone_number_1: string
  phone_number_2: string
}

const DetailRequestIncentiveHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  // Loader
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false)
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false)

  // Store
  const [store, setStore] = useState<Store[]>([])

  // Incentive Sales
  const [incentiveDetail, setIncentiveDetail] = useState<any>()
  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)
  const handleClose = () => setVisible(false)

  const getIncentiveData = async () => {
    try {
      await axios
        .get(`${apiUrl}/comission-sales-incentive/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setIncentiveDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          store_id: item.id,
          store_name: item.store_name,
          address: item.address,
          phone_number_1: item.phone_number_1,
          phone_number_2: item.phone_number_2,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getIncentiveData()
  }, [store])

  useEffect(() => {
    getStore()
  }, [])

  const getFormattedPeriod = () => {
    const now = new Date()
    const lastMonth = new Date(now)
    lastMonth.setMonth(now.getMonth() - 1)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('id-ID', {
        month: 'long',
      })
    }

    return `${formatDate(lastMonth)} - ${formatDate(now)} ${now.getFullYear()}`
  }

  // Generate PDF
  const generatePDF = () => {
    setLoadingPDF(true)
    axios
      .get(`${apiUrl}/comission-sales-incentive/${params.id}/pdf`, {
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
          `Insentif ID ${params.id} - ${formatDateWithTime(new Date())}.pdf`
        )
        document.body.appendChild(link)
        link.click()
      })
      .finally(() => {
        setLoadingPDF(false)
      })
  }

  // Export Excel
  const exportExcel = () => {
    setLoadingTemplate(true)

    axios
      .get(`${apiUrl}/comission-sales-incentive/${params.id}/export-excel`, {
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
          `Pengajuan Insentif ID ${params.id} - ${formatDateWithTime(new Date())}.xlsx`
        )
        document.body.appendChild(link)
        link.click()

        setLoadingTemplate(false)
      })
  }

  return (
    <section id='detail-incentive'>
      <Card>
        <Card.Body>
          <Row className='incentive-detail mb-5'>
            <Col md={12} className='incentive-information'>
              <h1 className='fs-1 text-center fw-bolder mb-5'>PENGAJUAN INSENTIF</h1>

              <div className='fs-4 fw-semibold'>
                ID : <span className='fw-normal'>{incentiveDetail?.id}</span>
              </div>

              <div className='fs-4 fw-semibold'>
                Tanggal dibuat :{' '}
                <span className='fw-normal'>{formatDate(incentiveDetail?.created_at)}</span>
              </div>

              <div className='fs-4 fw-semibold'>
                Periode : <span className='fw-normal'>{getFormattedPeriod()}</span>
              </div>
            </Col>
          </Row>

          <Row className='detail-table mb-2'>
            <Table responsive hover>
              <thead>
                <tr>
                  <th className='text-center'>Order ID</th>
                  <th className='text-center'>Tanggal Order</th>
                  <th className='text-center'>Nama Toko</th>
                  <th className='text-center'>Nomor Receipt</th>
                  <th className='text-center'>Nama Sales</th>
                  <th className='text-center'>Nama Bank</th>
                  <th className='text-center'>Nomor Akun</th>
                  <th className='text-center'>Total Insentif</th>
                </tr>
              </thead>

              <tbody>
                {incentiveDetail?.sales_incentive?.map((item: any) => (
                  <tr key={item?.id}>
                    <td align='center'>{item?.quotation?.order?.id}</td>
                    <td align='center'>{formatDate(item?.quotation?.order?.request_survey)}</td>
                    <td>
                      {
                        store.find((x: any) => x.store_id === item?.quotation?.order?.store_id)
                          ?.store_name
                      }
                    </td>
                    <td>
                      <Link to={`/order/detail-order/${item?.quotation?.order?.id}`}>
                        {item?.quotation?.order?.receipt_number}
                      </Link>
                    </td>
                    <td>{item?.sales?.full_name}</td>
                    <td>{item?.sales?.bank?.bank_name}</td>
                    <td>{item?.sales?.account_number}</td>
                    <td>{`Rp. ${parseInt(item?.nominal).toLocaleString('id')}`}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Grand Total
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    incentiveDetail?.total_amount ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Card.Body>
      </Card>

      <Card className='mt-5'>
        <Card.Header>
          <Card.Title>File Bukti Pembayaran</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col>
              <ListGroup>
                {incentiveDetail?.comission_sales_incentive_evidence?.map((item: any) => (
                  <ListGroup.Item
                    key={item.id}
                    action
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setPreviewImage(item.evidence_location)
                      setVisible(true)
                    }}
                  >
                    {item.evidence_location}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {incentiveDetail?.comission_sales_incentive_evidence?.length ? (
                <>
                  {previewImage && (
                    <div>
                      {previewImage.endsWith('.pdf') ? (
                        <div>
                          <Modal
                            dialogClassName='modal-show-pdf'
                            centered
                            show={visible}
                            onHide={handleClose}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>File - {previewImage}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                              <iframe
                                key={previewImage}
                                width='100%'
                                height='100%'
                                src={`${apiUrl}/public/comission_sales_incentive/${previewImage}`}
                                style={{border: 'none'}}
                              />
                            </Modal.Body>
                          </Modal>
                        </div>
                      ) : (
                        <Image
                          key={previewImage}
                          width={200}
                          style={{display: 'none'}}
                          src={`${apiUrl}/public/comission_sales_incentive/${previewImage}`}
                          preview={{
                            visible: visible,
                            src: `${apiUrl}/public/comission_sales_incentive/${previewImage}`,
                            onVisibleChange: (value) => {
                              setVisible(value)
                            },
                          }}
                        />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className='d-flex justify-content-start align-items-center'>
                  <p className='fs-7 text-danger'>Belum ada file tagihan</p>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className='button-wrapper d-flex justify-content-center align-items-center gap-3 mt-3'>
        <Button
          className='btn-dark-success d-flex justify-content-center align-items-center w-100 gap-3 m-0'
          disabled={loadingPDF}
          onClick={() => exportExcel()}
        >
          {loadingTemplate === false ? (
            <>
              <FontAwesomeIcon icon={faDownload} size='lg' />
              Export Excel
            </>
          ) : (
            'Exporting...'
          )}
        </Button>

        <Button
          className='btn-dark-primary d-flex justify-content-center align-items-center w-100 gap-3 m-0'
          onClick={() => generatePDF()}
        >
          {loadingPDF === false ? (
            <>
              <FontAwesomeIcon icon={faDownload} size='lg' />
              Download PDF
            </>
          ) : (
            'Generating PDF...'
          )}
        </Button>
      </div>
    </section>
  )
}

export {DetailRequestIncentiveHO}
