import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
  Descriptions,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select

interface ViolationLog {
  id: number
  vendor_id: number
  violation_type_id: number
  order_id: number | null
  quarter: number
  year: number
  description: string | null
  evidence_path: string | null
  is_active: boolean
  created_at: string
  vendor: {
    id: number
    company_name: string
    pic_name: string
  }
  violation_type: {
    id: number
    code: string
    category: string
    name: string
    point: number
  }
  orders?: {
    id: number
    project_number: string
  }
}

const CATEGORIES = [
  { value: 'KONFIRMASI_ORDER', label: 'Konfirmasi Order', color: 'blue' },
  { value: 'RESCHEDULE', label: 'Reschedule', color: 'orange' },
  { value: 'REFUND', label: 'Refund', color: 'red' },
  { value: 'LAINNYA', label: 'Lainnya', color: 'default' },
]

const ViewVendorViolationLog: React.FC = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<ViolationLog[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [detailModal, setDetailModal] = useState<ViolationLog | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [violationTypes, setViolationTypes] = useState<any[]>([])
  const [filters, setFilters] = useState({
    search: '',
    category: undefined as string | undefined,
    vendor_id: undefined as number | undefined,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        take: pagination.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.vendor_id && { vendor_id: filters.vendor_id.toString() }),
      })

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vendor-violation/log?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setData(response.data.data)
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
      }))
    } catch (error) {
      message.error('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vendor?vendor_with_max_order=0&take=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setVendors(response.data.data)
    } catch (error) {
      console.error('Failed to fetch vendors')
    }
  }

  const fetchViolationTypes = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vendor-violation/type?take=100&is_active=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setViolationTypes(response.data.data)
    } catch (error) {
      console.error('Failed to fetch violation types')
    }
  }

  useEffect(() => {
    fetchData()
    fetchVendors()
    fetchViolationTypes()
  }, [pagination.current, pagination.pageSize, filters])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const handleAdd = async (values: any) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.post(
        `${process.env.REACT_APP_API_URL}/vendor-violation/log`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      message.success('Pelanggaran berhasil dicatat')
      setAddModal(false)
      fetchData()
    } catch (error) {
      message.error('Gagal mencatat pelanggaran')
    }
  }

  const getCategoryColor = (category: string) => {
    const found = CATEGORIES.find((c) => c.value === category)
    return found?.color || 'default'
  }

  const columns: ColumnsType<ViolationLog> = [
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
      title: 'Jenis Pelanggaran',
      key: 'violation',
      render: (_, record) => (
        <div>
          <Tag color={getCategoryColor(record.violation_type?.category)}>
            {record.violation_type?.code}
          </Tag>
          <div className='small mt-1'>{record.violation_type?.name}</div>
        </div>
      ),
    },
    {
      title: 'Poin',
      dataIndex: ['violation_type', 'point'],
      key: 'point',
      width: 80,
      render: (point: number) => (
        <Badge count={point} showZero color='red' />
      ),
    },
    {
      title: 'Periode',
      key: 'period',
      width: 100,
      render: (_, record) => (
        <span>Q{record.quarter} {record.year}</span>
      ),
    },
    {
      title: 'Order',
      key: 'order',
      width: 120,
      render: (_, record) =>
        record.orders ? (
          <Tag>{record.orders.project_number}</Tag>
        ) : (
          <span className='text-muted'>-</span>
        ),
    },
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Tooltip title='Detail'>
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => setDetailModal(record)}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <div className='card card-xxl-stretch mb-5 mb-xxl-8'>
      <div className='card-header border-0 pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <div className='d-flex gap-2'>
              <Input.Search
                placeholder='Cari vendor...'
                onSearch={(value) =>
                  setFilters((prev) => ({ ...prev, search: value }))
                }
                style={{ width: 200 }}
              />
              <Select
                placeholder='Kategori'
                allowClear
                style={{ width: 150 }}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, category: value }))
                }
              >
                {CATEGORIES.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder='Pilih Vendor'
                allowClear
                showSearch
                style={{ width: 200 }}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, vendor_id: value }))
                }
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={vendors.map((v) => ({
                  value: v.id,
                  label: v.company_name,
                }))}
              />
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchData}>
                Refresh
              </Button>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => setAddModal(true)}
              >
                Catat Pelanggaran
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className='card-body py-3'>
        <Table
          columns={columns}
          dataSource={data}
          rowKey='id'
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} data`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        title='Detail Pelanggaran'
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={[
          <Button key='close' onClick={() => setDetailModal(null)}>
            Tutup
          </Button>,
        ]}
      >
        {detailModal && (
          <Descriptions column={1} bordered size='small'>
            <Descriptions.Item label='ID'>{detailModal.id}</Descriptions.Item>
            <Descriptions.Item label='Vendor'>
              {detailModal.vendor?.company_name}
            </Descriptions.Item>
            <Descriptions.Item label='Kategori'>
              <Tag color={getCategoryColor(detailModal.violation_type?.category)}>
                {detailModal.violation_type?.category}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Kode'>
              {detailModal.violation_type?.code}
            </Descriptions.Item>
            <Descriptions.Item label='Nama Pelanggaran'>
              {detailModal.violation_type?.name}
            </Descriptions.Item>
            <Descriptions.Item label='Poin'>
              {detailModal.violation_type?.point}
            </Descriptions.Item>
            <Descriptions.Item label='Periode'>
              Q{detailModal.quarter} {detailModal.year}
            </Descriptions.Item>
            <Descriptions.Item label='Order'>
              {detailModal.orders?.project_number || '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Deskripsi'>
              {detailModal.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Tanggal'>
              {new Date(detailModal.created_at).toLocaleString('id-ID')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Add Violation Modal */}
      <Modal
        title='Catat Pelanggaran Baru'
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
      >
        <AddViolationForm
          vendors={vendors}
          violationTypes={violationTypes}
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
        />
      </Modal>
    </div>
  )
}

// Add Violation Form Component
const AddViolationForm: React.FC<{
  vendors: any[]
  violationTypes: any[]
  onSubmit: (values: any) => void
  onCancel: () => void
}> = ({ vendors, violationTypes, onSubmit, onCancel }) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} layout='vertical' onFinish={onSubmit}>
      <Form.Item
        name='vendor_id'
        label='Vendor'
        rules={[{ required: true, message: 'Pilih vendor' }]}
      >
        <Select
          showSearch
          placeholder='Pilih Vendor'
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={vendors.map((v) => ({
            value: v.id,
            label: v.company_name,
          }))}
        />
      </Form.Item>

      <Form.Item
        name='violation_type_id'
        label='Jenis Pelanggaran'
        rules={[{ required: true, message: 'Pilih jenis pelanggaran' }]}
      >
        <Select placeholder='Pilih Pelanggaran'>
          {violationTypes.map((vt) => (
            <Option key={vt.id} value={vt.id}>
              [{vt.code}] {vt.name} ({vt.point} poin)
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name='order_id' label='Order (opsional)'>
        <Input type='number' placeholder='ID Order' />
      </Form.Item>

      <Form.Item name='description' label='Deskripsi'>
        <Input.TextArea rows={3} placeholder='Keterangan tambahan' />
      </Form.Item>

      <Form.Item className='mb-0 text-end'>
        <Space>
          <Button onClick={onCancel}>Batal</Button>
          <Button type='primary' htmlType='submit'>
            Simpan
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export { ViewVendorViolationLog }
