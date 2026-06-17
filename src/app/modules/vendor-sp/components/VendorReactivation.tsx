import React, { useState, useEffect } from 'react'
import { vendorSpService } from '../../../services/vendorSpService'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Alert,
  Descriptions,
} from 'antd'
import {
  ReloadOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  VendorSpPill,
  vendorSpPagination,
  vendorSpTableClassName,
} from './VendorSpTable'

interface ReactivationLog {
  id: number
  vendor_id: number
  previous_sp_id: number | null
  reason: string
  approved_by: number
  status: number
  notes: string | null
  created_at: string
  vendor: {
    id: number
    company_name: string
    pic_name: string
    is_active: boolean
  }
}

interface InactiveVendor {
  id: number
  company_name: string
  pic_name: string
  email_address: string
  phone_number: string
  is_active: boolean
}

const VendorReactivation: React.FC = () => {
  const [data, setData] = useState<ReactivationLog[]>([])
  const [inactiveVendors, setInactiveVendors] = useState<InactiveVendor[]>([])
  const [loading, setLoading] = useState(false)
  const [reactivateModal, setReactivateModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<InactiveVendor | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const fetchReactivationLogs = async () => {
    setLoading(true)
    try {
      const response = await vendorSpService.getReactivationLogs({
        page: pagination.current,
        take: pagination.pageSize,
      })
      const payload = response.data?.data && response.data?.meta
        ? response.data
        : response.data?.data || response.data
      const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
      const total = payload?.meta?.total ?? rows.length

      setData(rows)
      setPagination((prev) => ({
        ...prev,
        total,
      }))
    } catch (error) {
      Swal.fire('Error', 'Gagal mengambil data log reaktivasi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchInactiveVendors = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vendor?vendor_with_max_order=0&take=100&is_active=0`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const vendors: InactiveVendor[] = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : []
      setInactiveVendors(
        vendors.filter((vendor: InactiveVendor) => Number(vendor.is_active) === 0)
      )
    } catch (error) {
      console.error('Failed to fetch inactive vendors')
    }
  }

  useEffect(() => {
    fetchReactivationLogs()
    fetchInactiveVendors()
  }, [])

  const handleReactivate = async (values: any) => {
    try {
      await vendorSpService.reactivate({
        vendor_id: selectedVendor?.id,
        reason: values.reason,
      })
      Swal.fire('Berhasil', 'Vendor berhasil diaktifkan kembali', 'success')
      setReactivateModal(false)
      setSelectedVendor(null)
      fetchReactivationLogs()
      fetchInactiveVendors()
    } catch (error) {
      Swal.fire('Error', 'Gagal mengaktifkan vendor', 'error')
    }
  }

  const openReactivateModal = (vendor: InactiveVendor) => {
    setSelectedVendor(vendor)
    setReactivateModal(true)
  }

  const columns: ColumnsType<ReactivationLog> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_, record) => (
        <div>
          <div className='fw-bold'>{record.vendor?.company_name}</div>
          <div className='text-muted small'>{record.vendor?.pic_name}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        switch (record.status) {
          case 1:
            return <VendorSpPill color='processing'>Pending</VendorSpPill>
          case 2:
            return <VendorSpPill color='success'>Disetujui</VendorSpPill>
          case 3:
            return <VendorSpPill color='error'>Ditolak</VendorSpPill>
          default:
            return <VendorSpPill>Unknown</VendorSpPill>
        }
      },
    },
    {
      title: 'Alasan',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString('id-ID'),
    },
  ]

  return (
    <div className='card card-xxl-stretch mb-5 mb-xxl-8 vendor-sp-table'>
      <div className='card-header border-0 pt-5'>
        <div className='card-title d-flex flex-column'>
          <h3 className='card-label'>Reaktivasi Vendor SP3</h3>
          <span className='text-muted'>
            Vendor yang dinonaktifkan akibat SP3 dapat diaktifkan kembali melalui
            menu ini
          </span>
        </div>
        <div className='card-toolbar'>
          <Button icon={<ReloadOutlined />} onClick={fetchReactivationLogs}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Inactive Vendors Section */}
      <div className='card-body py-3'>
        <Alert
          message='Vendor Nonaktif'
          description='Vendor berikut dinonaktifkan akibat SP3. Klik tombol "Aktifkan" untuk mengaktifkan kembali.'
          type='warning'
          showIcon
          icon={<StopOutlined />}
          className='mb-4'
        />

        <div className='row mb-4'>
          {inactiveVendors.map((vendor) => (
            <div key={vendor.id} className='col-md-4 mb-3'>
              <Card
                size='small'
                title={vendor.company_name}
                extra={
                  <Button
                    type='primary'
                    size='small'
                    icon={<CheckCircleOutlined />}
                    onClick={() => openReactivateModal(vendor)}
                  >
                    Aktifkan
                  </Button>
                }
              >
                <Descriptions column={1} size='small'>
                  <Descriptions.Item label='PIC'>
                    {vendor.pic_name}
                  </Descriptions.Item>
                  <Descriptions.Item label='Email'>
                    {vendor.email_address}
                  </Descriptions.Item>
                  <Descriptions.Item label='Telepon'>
                    {vendor.phone_number}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          ))}
          {inactiveVendors.length === 0 && (
            <div className='col-12 text-center text-muted py-4'>
              Tidak ada vendor nonaktif
            </div>
          )}
        </div>

        <hr />

        <h5 className='mb-3'>Log Reaktivasi</h5>
        <Table
          className={vendorSpTableClassName}
          columns={columns}
          dataSource={data}
          rowKey='id'
          loading={loading}
          pagination={vendorSpPagination(pagination)}
          onChange={(newPagination: any) =>
            setPagination((prev) => ({
              ...prev,
              current: newPagination.current || 1,
              pageSize: newPagination.pageSize || prev.pageSize,
            }))
          }
        />
      </div>

      {/* Reactivate Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            Konfirmasi Reaktivasi Vendor
          </Space>
        }
        open={reactivateModal}
        onCancel={() => {
          setReactivateModal(false)
          setSelectedVendor(null)
        }}
        footer={null}
      >
        {selectedVendor && (
          <Form layout='vertical' onFinish={handleReactivate}>
            <Alert
              message={`Aktifkan Vendor: ${selectedVendor.company_name}`}
              description={
                <div>
                  <p>
                    Vendor ini sebelumnya dinonaktifkan akibat SP3. Dengan
                    mengaktifkan kembali, vendor akan dapat menerima order seperti
                    biasa.
                  </p>
                </div>
              }
              type='info'
              showIcon
              className='mb-3'
            />

            <Descriptions column={1} size='small' className='mb-3'>
              <Descriptions.Item label='Perusahaan'>
                {selectedVendor.company_name}
              </Descriptions.Item>
              <Descriptions.Item label='PIC'>
                {selectedVendor.pic_name}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>
                {selectedVendor.email_address}
              </Descriptions.Item>
            </Descriptions>

            <Form.Item
              name='reason'
              label='Alasan Reaktivasi'
              rules={[{ required: true, message: 'Wajib diisi' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder='Jelaskan alasan mengaktifkan kembali vendor ini...'
              />
            </Form.Item>

            <Form.Item className='mb-0 text-end'>
              <Space>
                <Button
                  onClick={() => {
                    setReactivateModal(false)
                    setSelectedVendor(null)
                  }}
                >
                  Batal
                </Button>
                <Button type='primary' htmlType='submit'>
                  Aktifkan Vendor
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export { VendorReactivation }
