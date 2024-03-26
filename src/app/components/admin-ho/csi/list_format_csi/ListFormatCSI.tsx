import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import axios from 'axios'
import {List, Space, PaginationProps} from 'antd'
import {Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faBook, faClock, faFileExcel, faDatabase} from '@fortawesome/free-solid-svg-icons'

const ListFormatCSI: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [csiData, setCsiData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const getCSI = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(`${apiUrl}/csi?page=${page}&take=${pageSize}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCsiData(response.data.data)
      setCurrentPage(response.data.page)
      setTotalData(response.data.takeTotal)
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getCSI(1, 10)
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

  const IconText = ({
    icon,
    text,
    link,
    openNewTab,
  }: {
    icon: any
    text: string
    link: string
    openNewTab: boolean
  }) => (
    <Space>
      <FontAwesomeIcon icon={icon} />

      <div className='text-link'>
        <a className='fs-6 text-black' href={link} target={openNewTab ? '_blank' : ''}>
          {text}
        </a>
      </div>
    </Space>
  )

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='format-csi'>
      <List
        itemLayout='vertical'
        size='small'
        dataSource={csiData}
        pagination={{
          current: currentPage,
          total: totalData,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50, 100],
          onChange: (page, pageSize) => {
            getCSI(page, pageSize)
          },
          itemRender: itemRender,
          showTotal: (total, range) => (
            <span style={{left: 0, position: 'absolute'}}>
              Showing {range[0]} - {range[1]} of {total} List CSI
            </span>
          ),
        }}
        renderItem={(item) => (
          <Card className='mb-5'>
            <List.Item
              key={item.title}
              extra={
                <img
                  width={200}
                  alt='image'
                  src={toAbsoluteUrl('/media/csi/Formulir Kepuasan Pelanggan.png')}
                />
              }
              actions={[
                <IconText
                  icon={faPen}
                  text='Update Format'
                  link={`/csi/update-csi/${item.id}`}
                  openNewTab={false}
                />,

                <IconText
                  icon={faBook}
                  text='Open Survey Form'
                  link={item.survey_link}
                  openNewTab={true}
                />,

                <IconText
                  icon={faFileExcel}
                  text='Open Spreadsheet'
                  link={item.spreadsheets_link}
                  openNewTab={true}
                />,

                <IconText
                  icon={faDatabase}
                  text='Open Respons Survey'
                  link={`/csi/view-csi/${item.id}`}
                  openNewTab={false}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <a className='fs-1 text-dark fw-semibold' href={item.survey_link}>
                    {item.name}
                  </a>
                }
              />

              <Space>
                <FontAwesomeIcon icon={faClock} />
                <div className='fs-5'>Date Created : {formatDate(new Date(item.created_at))}</div>
              </Space>
            </List.Item>
          </Card>
        )}
      />

      {/* <iframe
        className='csi-frame'
        src='https://docs.google.com/forms/d/e/1FAIpQLScigS6VCCMrZZkTzDsIjgLFRx8F_7ka8dVzNPmd9SLbHO6Bjg/viewform?embedded=true'
        width='2000px'
        height='100%'
      >
        Memuat…
      </iframe> */}
    </section>
  )
}

export {ListFormatCSI}
