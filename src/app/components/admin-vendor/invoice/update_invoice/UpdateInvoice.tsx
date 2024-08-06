import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateInvoice.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, PaginationProps, Spin, Pagination} from 'antd'
import {Form, Row, Col, Button, Card} from 'react-bootstrap'

interface Status {
  value: number | null
  category: string
}

interface Store {
  store_id: number
  store_name: string
  address: string
  phone_number_1: string
  phone_number_2: string
}

interface DataType {
  id: number
  order_id: number
  store_name: string
  date_order: string
  member_name: string
  order_type: string
  order_status: string
  order_status_label: string
}

interface InvoiceData {
  vendor_id: number | null
  status: number | null
  invoice_evidences: Array<any>
  invoice_details: Array<{
    id?: number | null
    order_id: number | null
    type?: number | null
  }>
}

// Table Column
const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 110,
    className: 'col_order_id',
    sorter: (a, b) => a.order_id - b.order_id,
  },
  {
    title: 'Tanggal Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 130,
    onFilter: (value, record) => record.date_order.includes(String(value)),
    sorter: (a, b) => a.date_order.length - b.date_order.length,
  },
  {
    title: 'Nama Konsumen',
    dataIndex: 'member_name',
    key: 'member_name',
    align: 'center',
    width: 150,
    onFilter: (value, record) => record.member_name.includes(String(value)),
    sorter: (a, b) => a.member_name.length - b.member_name.length,
  },
  {
    title: 'Tipe Pengerjaan',
    dataIndex: 'order_type',
    key: 'order_type',
    align: 'left',
    width: 140,
    onFilter: (value, record) => record.order_type.includes(String(value)),
    sorter: (a, b) => a.order_type.length - b.order_type.length,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status_label',
    key: 'order_status_label',
    align: 'left',
    width: 140,
    onFilter: (value, record) => record.order_status_label.includes(String(value)),
    sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
    render: (order_status_label) => {
      const orderStatus = order_status_label
      return <Tag color='green'>{orderStatus}</Tag>
    },
  },
]

const UpdateInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  const vendorId = localStorage.getItem('vendor_id')

  const [store, setStore] = useState<Store[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const desiredStatus = statusData.filter((status: any) =>
    ['SURVEYDONE', 'WORKEND'].includes(status.category)
  )

  // Update Invoice
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [invoiceStore, setInvoiceStore] = useState<any>()
  const [invoiceDetail, setInvoiceDetail] = useState<DataType[]>([])
  const [invoices, setInvoices] = useState<InvoiceData>({
    vendor_id: Number(vendorId),
    status: null,
    invoice_evidences: [],
    invoice_details: [
      {
        id: null,
        order_id: null,
        type: null,
      },
    ],
  })

  console.log('invoices', invoices)

  // Fetch Invoice
  const getOrders = async (page: number, pageSize: number, queryparams: any) => {
    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)
      let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&page=${page}&work_order_status=${statuses}&is_invoice=1&take=${pageSize}${queryparams}`

      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data

      setCurrentPage(response.data.page)
      setTotalData(response.data.total)
      setLoadData(false)

      return data
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const getInvoiceById = async () => {
    const response = await axios.get(`${apiUrl}/invoices/${params.id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
      },
    })

    const data = response.data.data

    setInvoiceStore(data)
    setSelectedRowKeys(data?.invoice_details.map((item: any) => item.order_id))
    setInvoices((prevInvoices) => ({
      ...prevInvoices,
      status: data?.status,
      invoice_details: data?.invoice_details.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        type: item.type,
      })),
    }))

    return response.data.data
  }

  useEffect(() => {
    getInvoiceById()
  }, [])

  const ViewInvoice = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getOrders(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getOrders')
        return []
      }

      const invoiceDetails = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const orderType = (() => {
          if (
            item?.payment_type === 'survey' &&
            ['SURVEYDONE'].includes(item?.work_orders?.work_order_status[0]?.status?.category)
          ) {
            return 'Survei'
          } else if (
            item?.payment_type === 'survey' &&
            ['WORKEND'].includes(item?.work_orders?.work_order_status[0]?.status?.category)
          ) {
            return 'Pengerjaan'
          } else if (item?.payment_type === 'gratis') {
            return 'Pengerjaan'
          } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
            return 'Pengerjaan'
          } else {
            return ''
          }
        })()

        data = {
          id: item?.id,
          order_id: item?.id,
          store_name: item?.store?.store_name,
          date_order: orderDate,
          member_name: item?.members?.full_name,
          order_type: orderType,
          order_status: item?.work_orders?.work_order_status[0]?.status?.category,
          order_status_label: item?.work_orders?.work_order_status[0]?.status?.description,
        }

        return data
      })

      return invoiceDetails
    } catch (error) {
      console.error('Error getting work order list data:', error)
      return []
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

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewInvoice(page, pageSize, queryparams)
    setInvoiceDetail(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [store])

  useEffect(() => {
    getStore()
  }, [])

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const invoiceType = selectedRows.map((row) => ({
        order_id: row.order_id,
        type: row.order_status === 'SURVEYDONE' ? 1 : row.order_status === 'WORKEND' ? 2 : 0,
      }))

      setSelectedRowKeys(selectedRowKeys)
      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        invoice_details: invoiceType,
      }))

      // setInvoices((prevInvoices) => ({
      //   ...prevInvoices,
      //   invoice_details: selectedRows.map((row) => ({
      //     order_id: row.order_id,
      //   })),
      // }))

      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  // Invoice Validation
  const InvoiceValidation = () => {
    let valid = true

    if (!invoices.invoice_details.some((item: any) => item.order_id !== null)) {
      Swal.fire({
        title: 'Warning',
        text: 'Pilih Order yang ingin diberi Invoice ',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Store Data
  const storeIds = invoiceStore?.invoice_details?.map((item: any) => item?.order?.store_id) || []

  const storeData = (
    ids: number[]
  ): {storeName: string; storeAddress: string; storePhoneNumber: string} => {
    const uniqueStoreIds = Array.from(new Set(ids))

    const storeName = uniqueStoreIds
      .map((storeId: number) => {
        return store.find((x: Store) => x.store_id === storeId)?.store_name
      })
      .filter(Boolean)
      .join(', ')

    const storeAddress = uniqueStoreIds
      .map((storeId: number) => {
        return store.find((x: Store) => x.store_id === storeId)?.address
      })
      .filter(Boolean)
      .join(', ')

    const storePhoneNumber = uniqueStoreIds
      .map(
        (storeId: number) =>
          store.find((x: Store) => x.store_id === storeId)?.phone_number_1 ||
          store.find((x: Store) => x.store_id === storeId)?.phone_number_2
      )
      .join(', ')

    return {storeName, storeAddress, storePhoneNumber}
  }
  const {storeName, storeAddress, storePhoneNumber} = storeData(storeIds)

  // Handle Update
  const handleUpdateInvoice = async () => {
    if (!InvoiceValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
    const formData = new FormData()

    formData.append('vendor_id', String(invoices.vendor_id))
    formData.append('status', String(1))
    invoices.invoice_details.forEach((invoice, index) => {
      if (invoice.order_id !== null) {
        // formData.append(`invoice_details[${index}][id]`, String(invoice.id))
        formData.append(`invoice_details[${index}][order_id]`, String(invoice.order_id))
        formData.append(`invoice_details[${index}][type]`, String(invoice.type))
      }
    })

    try {
      const response = await axios.post(`${apiUrl}/invoices/${params.id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.data.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Success Update Invoice',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(`/invoice/view-invoice`)
        })

        setIsLoading(false)
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        })

        setIsLoading(false)
      }
    } catch (error: any) {
      console.error(error)
      setIsLoading(false)

      Swal.fire({
        title: 'Error',
        text: error.response.data.message,
        icon: 'error',
      })
    }
  }

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

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

  return (
    <section id='update-invoice'>
      <Card>
        <Card.Body>
          <Row className='invoice-detail mb-4'>
            <Col xxl={6} xl={6} md={6} sm={12} className='vendor-information'>
              <h1 className='fw-bolder'>{invoiceStore?.vendor?.company_name}</h1>
              <div className='fs-3 fw-normal'>{invoiceStore?.vendor?.address}</div>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='invoice-information'>
              <h1 className='fw-bolder'>INVOICE</h1>

              <div className='fs-3 fw-semibold'>
                Invoice ID : <span className='fw-normal'>{invoiceStore?.id}</span>
              </div>

              <div className='fs-3 fw-semibold'>
                Tanggal Dibuat :{' '}
                <span className='fw-normal'>
                  {new Date(invoiceStore?.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className='fs-3 fw-semibold'>
                Periode : <span className='fw-normal'>{getFormattedPeriod()}</span>
              </div>
            </Col>
          </Row>

          <Row className='invoice-detail mb-4'>
            <Col xxl={6} xl={6} md={6} sm={12} className='receiver-information'>
              <div className='fs-2 fw-semibold'>Ditunjukkan kepada :</div>
              <div className='fs-4 mb-2 fw-bold'>PT Catur Mitra Sejati Sentosa</div>
              <h3 className='fs-4 mb-2 fw-normal'>
                Jl. Gading Serpong Boulevard Blok mitra 10, Curug Sangereng, Kec. Klp. Dua,
                Kabupaten Tangerang, Banten 15820
              </h3>
              <h3 className='fs-4 mb-2 fw-normal'>Telp : 0878-8482-1089</h3>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='notes'>
              {invoiceStore?.status === 3 && (
                <div className='fs-3 fw-semibold text-danger'>
                  Alasan ditolak : <br></br>
                  <span className='text-dark fw-normal'>{invoiceStore?.notes}</span>
                </div>
              )}
            </Col>
          </Row>

          <Form.Text className='fs-7 text-danger fw-semibold'>
            *Hapus centang daftar order jika ingin mengeluarkan order tersebut dari invoice ini.
          </Form.Text>

          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
          >
            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={invoiceDetail}
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                preserveSelectedRowKeys: true,
                ...rowSelection,
              }}
              rowKey={(record) => record.order_id}
              pagination={false}
              tableLayout='auto'
              scroll={{x: 'max-content'}}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalData}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Total Invoice
              </span>
            )}
          />

          <div className='d-flex justify-content-center align-items-center mt-5 gap-3'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-success'
              type='submit'
              onClick={() => handleUpdateInvoice()}
            >
              {invoiceStore?.status === 1
                ? 'Update Invoice'
                : isLoading
                ? 'Updating..'
                : 'Kirim Kembali Invoice'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateInvoiceVendor}
