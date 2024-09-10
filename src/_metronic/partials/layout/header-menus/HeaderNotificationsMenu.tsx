/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'

import {formatDateWithTime} from '../../../helpers'

import axios from 'axios'
import {Button} from 'react-bootstrap'
import {Tag, Checkbox, List, Pagination} from 'antd'

type Props = {
  notificationData: any[]
  checkedData: Notifications[]
  currentPage: number
  pageSize: number
  totalData: number
  setPageSize: (size: number) => void
  getNotifications: (page: number, pageSize: number) => void
}

interface Notifications {
  id: number | null
  is_read: boolean
}

const HeaderNotificationsMenu: React.FC<Props> = ({
  notificationData,
  checkedData,
  currentPage,
  pageSize,
  totalData,
  setPageSize,
  getNotifications,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const role = localStorage.getItem('userRole') as string

  // State
  const [notifications, setNotifications] = useState<any[]>([])
  const [checked, setChecked] = useState<Notifications[]>([])
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false)

  const checkedCount = checked.filter((item) => item.is_read).length
  const isCheckedAll = checkedCount === notifications.length
  const isIndeterminate = checkedCount > 0 && checkedCount < notifications.length

  console.log('checked', checked)

  // Fetching Data
  useEffect(() => {
    setNotifications(notificationData)
    setChecked(checkedData)
  }, [notificationData, checkedData])

  // Mapping Data
  const moduleTypeMap: {
    [key: string]: {
      name: string
      url: (role: string) => string
      disabled: (role: string) => boolean
    }
  } = {
    ORDERS: {
      name: 'Pesanan',
      url: (role: string) =>
        ['Owner Vendor', 'Admin Vendor', 'Tukang'].includes(role)
          ? '/work-order/detail-work-order'
          : '/order/detail-order',
      disabled: () => false,
    },
    QUOTATION: {
      name: 'Quotation',
      url: () => '/quotation/detail-quotation',
      disabled: (role: string) =>
        ['Super User', 'Admin HO', 'Owner Vendor', 'Admin Vendor'].includes(role) ? false : true,
    },
    COMPLAINTS: {
      name: 'Pengaduan',
      url: (role: string) =>
        ['Owner Vendor', 'Admin Vendor'].includes(role)
          ? '/complaint/update-complaint'
          : '/complaint/detail-complaint',
      disabled: () => false,
    },
    RESCHEDULES: {
      name: 'Perubahan Jadwal',
      url: (role: string) =>
        ['Tukang'].includes(role)
          ? '/reschedule/detail-reschedule'
          : '/reschedule/update-reschedule',
      disabled: () => false,
    },
    REFUNDS: {
      name: 'Pengembalian Dana',
      url: () => '/refund/detail-refund',
      disabled: (role: string) =>
        ['Owner Vendor', 'Admin Vendor', 'Tukang'].includes(role) ? true : false,
    },
    INVOICES: {
      name: 'Invoice',
      url: () => '/invoice/detail-invoice',
      disabled: (role: string) =>
        ['Super User', 'Admin HO', 'Owner Vendor', 'Admin Vendor'].includes(role) ? false : true,
    },
    INCENTIVE: {
      name: 'Insentif',
      url: () => '/reports/report-insentif',
      disabled: (role: string) =>
        ['Owner Vendor', 'Admin Vendor', 'Tukang'].includes(role) ? true : false,
    },
  }

  const actionMap: {[key: string]: (moduleType: string) => string} = {
    CREATE: (moduleType) => `Pembuatan ${moduleType} Baru`,
    UPDATE: (moduleType) => `Pembaruan ${moduleType}`,
  }

  // Handler
  const onCheckAllChange = (e: any) => {
    const checkedStatus = e.target.checked

    setChecked((prevChecked) =>
      prevChecked.map((item) => ({
        ...item,
        is_read: checkedStatus,
      }))
    )
  }

  const onCheckItemChange = (id: number | null) => {
    setChecked((prevChecked) =>
      prevChecked.map((item) => (item.id === id ? {...item, is_read: !item.is_read} : item))
    )
  }

  // Handle Submit
  const handleSubmit = async () => {
    setIsLoadingSubmit(true)

    const filteredChecked = checked.filter((item) => item.is_read === true)

    await axios
      .post(`${apiUrl}/notifications`, filteredChecked, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          setIsLoadingSubmit(false)
        } else {
          setIsLoadingSubmit(false)
        }
      })
      .catch((error) => {
        setIsLoadingSubmit(false)
      })
  }

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-450px'
      data-kt-menu='true'
    >
      <div className='d-flex justify-content-between align-items-center border border-bottom-2 p-5'>
        <h3 className='fs-5 fw-bold '>Notifications</h3>

        <div className='trigger-read d-flex align-items-center gap-3 '>
          <Tag className='fs-8 opacity-75 ' color='blue'>
            {`${totalData} Unread`}
          </Tag>
        </div>
      </div>

      <div className='p-5'>
        <Checkbox
          indeterminate={isIndeterminate}
          onChange={onCheckAllChange}
          checked={isCheckedAll}
        >
          Check all
        </Checkbox>
      </div>

      <div className='notification-wrapper' style={{maxHeight: '400px', overflowY: 'auto'}}>
        <List
          itemLayout='vertical'
          size='small'
          dataSource={notifications}
          renderItem={(item) => {
            const module = moduleTypeMap[item.module_type] || {name: item.module_type, url: '#'}
            const moduleUrl =
              item.module_type === 'INCENTIVE'
                ? moduleTypeMap[item.module_type].url(role)
                : `${moduleTypeMap[item.module_type].url(role)}/${item.module_id}`

            return (
              <List.Item
                key={item.id}
                style={{
                  backgroundColor: item.is_read === true ? '#D9DDDC' : '#FFFFFF',
                  borderBottom: '1px solid black',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox
                      checked={checked.find((notif) => notif.id === item.id)?.is_read || false}
                      onChange={() => onCheckItemChange(item.id)}
                    />
                  }
                  title={
                    <div className='d-flex justify-content-between align-items-center'>
                      {moduleTypeMap[item.module_type].disabled(role) ? (
                        <h1 className='fs-7 text-dark fw-bold'>
                          {actionMap[item.action]?.(module.name) || item.action} oleh{' '}
                          {item?.created_by?.username}
                        </h1>
                      ) : (
                        <a className='fs-7 text-dark fw-bold' href={moduleUrl}>
                          {actionMap[item.action]?.(module.name) || item.action} oleh{' '}
                          {item?.created_by?.username}
                        </a>
                      )}

                      <Tag color='blue'>{item?.status_description}</Tag>
                    </div>
                  }
                  description={
                    <div className='description'>
                      <div className='fs-7 text-dark fw-semibold'>
                        Order ID : {item?.parsedData?.orders?.id ?? ''}
                      </div>

                      <div className='fs-7 text-dark opacity-75'>
                        Pada : {formatDateWithTime(item?.created_at)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )
          }}
        />
      </div>

      <div className='pagination-container p-5'>
        <span className='total-text fs-8'>
          {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalData)} of{' '}
          {totalData} Notif
        </span>

        <Pagination
          className='pagination'
          size='small'
          current={currentPage}
          total={totalData}
          defaultPageSize={pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 20, 50, 100]}
          onShowSizeChange={(current, size) => {
            setPageSize(size)
          }}
          onChange={(page, pageSize) => {
            getNotifications(page, pageSize)
          }}
        />
      </div>

      <div className='button-wrapper border border-bottom-2 p-5 gap-3'>
        <Button
          size='sm'
          className='btn btn-primary d-flex justify-content-center align-items-center w-100'
          onClick={() => handleSubmit()}
        >
          <p className='fs-8'>{isLoadingSubmit ? 'Loading...' : 'Mark as read'}</p>
        </Button>
      </div>
    </div>
  )
}

export {HeaderNotificationsMenu}
