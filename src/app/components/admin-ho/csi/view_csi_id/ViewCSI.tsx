/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import './ViewCSI.css'

import axios from 'axios'
import {List, PaginationProps} from 'antd'
import {Card, Row} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'

type Props = {
  className: string
}

const ViewCSIHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [csiAnswer, setCsiAnswer] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const getCSI = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(`${apiUrl}/csi/${params.id}?page=${page}&take=${pageSize}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.csi_answers?.length ?? 0)

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

      const csiData = apiData?.csi_answers.map((item: any) => {
        const jsonData = JSON.parse(item.data)
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

  return (
    <section id='view-csi'>
      <div className='table-view-order'>
        <Row>
          <List
            itemLayout='vertical'
            size='small'
            dataSource={csiAnswer}
            pagination={{
              current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              defaultPageSize: 5,
              onChange: (page, pageSize) => {
                getCSI(page, pageSize)
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} List Respons CSI
                </span>
              ),
            }}
            renderItem={(item) => (
              <Card className='mb-5'>
                <List.Item key={item?.wewe}>
                  <List.Item.Meta
                    title={
                      <div className='fs-3 text-dark fw-semibold'>
                        <FontAwesomeIcon icon={faClock} /> Tanggal : {item?.Timestamp}
                      </div>
                    }
                  />

                  {Object.entries(item)
                    .splice(2)
                    .map(([key, value]) => (
                      <div>
                        <div className='fs-5'>{`Pertanyaan : ${key}`}</div>
                        <div className='fs-5'>{`Jawaban : ${value}`}</div>
                      </div>
                    ))}
                </List.Item>
              </Card>
            )}
          />
        </Row>
      </div>
    </section>
  )
}

export {ViewCSIHO}
