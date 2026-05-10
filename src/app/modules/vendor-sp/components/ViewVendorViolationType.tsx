import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
  InputNumber,
  message,
  Popconfirm,
  Switch,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select

interface ViolationType {
  id: number
  code: string
  category: string
  name: string
  description: string | null
  point: number
  is_active: boolean
  created_at: string
}

const CATEGORIES = [
  { value: 'KONFIRMASI_ORDER', label: 'Konfirmasi Order' },
  { value: 'RESCHEDULE', label: 'Reschedule' },
  { value: 'REFUND', label: 'Refund' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

const ViewVendorViolationType: React.FC = () => {
  const [data, setData] = useState<ViolationType[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ViolationType | null>(null)
  const [form] = Form.useForm()
  const [filters, setFilters] = useState({
    search: '',
    category: undefined as string | undefined,
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
      })

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vendor-violation/type?${params}`,
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

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize, filters])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'KONFIRMASI_ORDER':
        return 'blue'
      case 'RESCHEDULE':
        return 'orange'
      case 'REFUND':
        return 'red'
      case 'LAINNYA':
        return 'default'
      default:
        return 'default'
    }
  }

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: ViolationType) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/vendor-violation/type/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      message.success('Data berhasil dihapus')
      fetchData()
    } catch (error) {
      message.error('Gagal menghapus data')
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem('accessToken')
      if (editingRecord) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/vendor-violation/type/${editingRecord.id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        message.success('Data berhasil diperbarui')
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/vendor-violation/type`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        message.success('Data berhasil ditambahkan')
      }
      setIsModalOpen(false)
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Terjadi kesalahan')
    }
  }

  const columns: ColumnsType<ViolationType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Kode',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: 'Nama Pelanggaran',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Poin',
      dataIndex: 'point',
      key: 'point',
      width: 80,
      render: (point: number) => (
        <Tag color={point >= 2 ? 'red' : 'orange'}>{point} Poin</Tag>
      ),
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Aktif' : 'Nonaktif'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size='small'>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title='Hapus data ini?'
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type='link' icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
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
                placeholder='Cari...'
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
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchData}>
                Refresh
              </Button>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                Tambah Jenis Pelanggaran
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
        />
      </div>

      <Modal
        title={editingRecord ? 'Edit Jenis Pelanggaran' : 'Tambah Jenis Pelanggaran'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='code'
            label='Kode'
            rules={[{ required: true, message: 'Kode wajib diisi' }]}
          >
            <Input placeholder='Contoh: ORDER_NOT_CONFIRMED_H' />
          </Form.Item>

          <Form.Item
            name='category'
            label='Kategori'
            rules={[{ required: true, message: 'Kategori wajib diisi' }]}
          >
            <Select placeholder='Pilih kategori'>
              {CATEGORIES.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='name'
            label='Nama Pelanggaran'
            rules={[{ required: true, message: 'Nama wajib diisi' }]}
          >
            <Input placeholder='Nama pelanggaran' />
          </Form.Item>

          <Form.Item
            name='description'
            label='Deskripsi'
          >
            <Input.TextArea rows={3} placeholder='Deskripsi detail' />
          </Form.Item>

          <Form.Item
            name='point'
            label='Poin'
            rules={[{ required: true, message: 'Poin wajib diisi' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name='is_active' label='Status' valuePropName='checked'>
            <Switch />
          </Form.Item>

          <Form.Item className='mb-0 text-end'>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type='primary' htmlType='submit'>
                Simpan
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export { ViewVendorViolationType }
