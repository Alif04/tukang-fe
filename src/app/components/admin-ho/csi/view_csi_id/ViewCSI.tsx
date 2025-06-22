/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import './ViewCSI.css'

import axios from 'axios'
import {List, PaginationProps} from 'antd'
import {Card, Row, Col, Badge, Table} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock, faUser, faPhone, faLocationDot} from '@fortawesome/free-solid-svg-icons'
import {formatDateWithTimeZone} from '../../../../../_metronic/helpers'

const ViewCSIHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [csiAnswer, setCsiAnswer] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const getCSI = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(`${apiUrl}/csi/${params.id}/csi-answers`, {
        params: {
          order_by: 'desc',
          page: page,
          take: pageSize,
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewCSI = async (page: number, pageSize: number) => {
    try {
      const apiData = await getCSI(page, pageSize)

      if (!apiData) {
        console.error('No data received from csi data')
        return []
      }

      const csiData = apiData?.map((item: any) => {
        const jsonData = JSON.parse(item.data)

        const parseTimestampToISO = (timestamp: string) => {
          try {
            const [datePart, timePart] = timestamp.split(' ')
            const [month, day, year] = datePart.split('/')

            const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(
              2,
              '0'
            )}T${timePart}`

            const date = new Date(isoString)

            return date.toISOString()
          } catch (error) {
            console.error('Error parsing timestamp:', error)
            return new Date().toISOString()
          }
        }

        jsonData.Timestamp = formatDateWithTimeZone(parseTimestampToISO(jsonData.Timestamp))

        return jsonData
      })

      return csiData
    } catch (error) {
      console.error('Error getting csi list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewCSI(page, pageSize)
    setCsiAnswer(data)
  }

  useEffect(() => {
    fetchData(1, 10)
    // eslint-disable-next-line
  }, [])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  // Helper function to determine if a field is contact info
  const isContactField = (key: string) => {
    const contactFields = ['nama konsumen', 'no telepon', 'alamat konsumen']
    return contactFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))
  }

  // Helper function to get appropriate icon for contact fields
  const getContactIcon = (key: string) => {
    if (key.toLowerCase().includes('nama')) return faUser
    if (key.toLowerCase().includes('telepon')) return faPhone
    if (key.toLowerCase().includes('alamat')) return faLocationDot
    return null
  }

  // Helper function to get badge color based on value
  const getAnswerBadge = (value: string) => {
    const lowerValue = value.toLowerCase()

    if (lowerValue === 'puas') {
      return <Badge bg='success'>{value}</Badge>
    } else if (lowerValue === 'biasa saja') {
      return <Badge bg='primary'>{value}</Badge>
    } else if (lowerValue === 'tidak puas') {
      return <Badge bg='danger'>{value}</Badge>
    }

    return <div className='text-dark fw-medium'>{value}</div>
  }

  return (
    <section id='view-csi'>
      <div className='list-view d-flex flex-column gap-3 mb-20'>
        <div className='list-header d-flex flex-column gap-5'>
          <div className='title'>
            <h1 className='text-dark fw-bold mb-2'>Respons CSI</h1>

            <p className='text-muted fs-5'>
              Tinjau dan Analisis tanggapan data indeks kepuasan pelanggan (CSI)
            </p>
          </div>

          <div className='body'>
            <h4 className='fw-semibold'>Respons terbaru:</h4>
          </div>
        </div>

        <List
          itemLayout='vertical'
          size='small'
          dataSource={csiAnswer}
          pagination={{
            current: currentPage,
            total: totalData,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50, 100],
            defaultPageSize: 10,
            onChange: (page, pageSize) => {
              fetchData(page, pageSize)
            },
            itemRender: itemRender,
            showTotal: (total, range) => (
              <span style={{left: 0, position: 'absolute'}} className='text-muted'>
                Showing {range[0]} - {range[1]} of {total} List Respons CSI
              </span>
            ),
          }}
          renderItem={(item, index) => (
            <Card className='mb-5 shadow-sm border-0' style={{borderRadius: '12px'}}>
              <Card.Header
                className='bg-light border-0 d-flex justify-content-between align-items-center'
                style={{borderRadius: '12px 12px 0 0'}}
              >
                <div>
                  <h5 className='mb-1 text-dark fw-bold'>Responden ke-{index + 1}</h5>
                </div>

                <div className='d-flex align-items-center text-muted'>
                  <FontAwesomeIcon icon={faClock} className='me-2' />

                  <span className='fw-medium'>{item?.Timestamp}</span>
                </div>
              </Card.Header>

              <Card.Body className='p-4'>
                <List.Item key={item?.id} className='border-0 p-0'>
                  <div className='mb-4'>
                    <h6 className='text-primary fw-bold mb-3 border-bottom pb-2'>
                      Informasi Responden
                    </h6>

                    <Row className='g-3'>
                      {Object.entries(item)
                        .slice(2)
                        .filter(([key, value]) => isContactField(key) && value !== '')
                        .map(([key, value], idx) => {
                          const icon = getContactIcon(key)

                          return (
                            <Col md={12} key={`contact-${key}-${idx}`}>
                              <div className='d-flex align-items-center p-3 bg-light rounded-3'>
                                {icon && <FontAwesomeIcon icon={icon} className='text-dark mx-3' />}

                                <div className='mx-3'>
                                  <div className='text-dark small fw-medium'>{key}</div>
                                  <div className='text-dark fw-semibold'>{value as string}</div>
                                </div>
                              </div>
                            </Col>
                          )
                        })}
                    </Row>
                  </div>

                  <div className='list-respons'>
                    <h6 className='text-primary fw-bold mb-3 border-bottom pb-2'>
                      Tanggapan Survey
                    </h6>

                    <Table responsive borderless className=''>
                      <tbody>
                        {Object.entries(item)
                          .slice(2)
                          .filter(([key, value]) => !isContactField(key) && value !== '')
                          .map(([key, value], idx) => [
                            <tr key={`question-${key}-${idx}`}>
                              <td
                                className='text-dark fw-semibold'
                                style={{
                                  width: '105px',
                                  padding: '10px 0 10px 0',
                                  verticalAlign: 'top',
                                }}
                              >
                                <div className='d-flex flex-column gap-1'>
                                  <div className='d-flex justify-content-between'>
                                    <p>Pertanyaan</p>
                                    <p>:</p>
                                  </div>

                                  <div className='d-flex justify-content-between'>
                                    <p>Jawaban</p>
                                    <p>:</p>
                                  </div>
                                </div>
                              </td>

                              <td
                                className=' text-dark fw-medium'
                                style={{
                                  verticalAlign: 'top',
                                }}
                              >
                                <div className='d-flex flex-column gap-1'>
                                  <div>{key}</div>

                                  <div>{getAnswerBadge(value as string)}</div>
                                </div>
                              </td>
                            </tr>,
                          ])
                          .flat()}
                      </tbody>
                    </Table>
                  </div>
                </List.Item>
              </Card.Body>
            </Card>
          )}
        />
      </div>
    </section>
  )
}

export {ViewCSIHO}
