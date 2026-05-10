import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendorSpService } from '../../../services/vendorSpService'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Modal,
  message,
  Tooltip,
  Badge,
} from 'antd'
import {
  EyeOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { RangePicker } = DatePicker
const { Option } = Select

interface VendorSP {
  id: number
  vendor_id: number
  sp_level: number
  total_point: number
  quarter: number
  year: number
  start_date: string
  end_date: string
  status: number
  allocation_reduction: number | null
  notes: string | null
  created_at: string
  vendor: {
    id: number
    company_name: string
    pic_name: string
    is_active: boolean
  }
}

const ViewVendorSP: React.FC = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<VendorSP[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [filters, setFilters] = useState({
    search: '',
    sp_level: undefined as number | undefined,
    status: undefined as number | undefined,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        take: pagination.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.sp_level && { sp_level: filters.sp_level.toString() }),
        ...(filters.status && { status: filters.status.toString() }),
      })
      const response = await vendorSpService.getAll(params)

      setData(response.data.data)
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
      }))
    } catch (error) {
      message.error('Gagal mengambil data Surat Peringatan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filters.status, filters.sp_level, filters.search])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const getSpLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'orange'
      case 2:
        return 'red'
      case 3:
        return 'purple'
      default:
        return 'default'
    }
  }

  const getSpLevelText = (level: number) => {
    switch (level) {
      case 1:
        return 'SP1'
      case 2:
        return 'SP2'
      case 3:
        return 'SP3'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'processing'
      case 2:
        return 'success'
      case 3:
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return 'Aktif'
      case 2:
        return 'Selesai'
      case 3:
        return 'Diperpanjang'
      default:
        return 'Unknown'
    }
  }

  const handleComplete = async (id: number) => {
    Modal.confirm({
      title: 'Konfirmasi',
      icon: <CheckCircleOutlined />,
      content: 'Apakah Anda yakin ingin menyelesaikan SP ini?',
      onOk: async () => {
        try {
          await vendorSpService.complete(id)
          message.success('SP berhasil diselesaikan')
          fetchData()
        } catch (error) {
          message.error('Gagal menyelesaikan SP')
        }
      },
    })
  }

  const columns: ColumnsType<VendorSP> = [
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
      title: 'Level SP',
      dataIndex: 'sp_level',
      key: 'sp_level',
      render: (level: number) => (
        <Tag color={getSpLevelColor(level)} className='fw-bold'>
          {getSpLevelText(level)}
        </Tag>
      ),
    },
    {
      title: 'Total Poin',
      dataIndex: 'total_point',
      key: 'total_point',
      render: (point: number) => (
        <Badge count={point} showZero color='red' />
      ),
    },
    {
      title: 'Periode',
      key: 'period',
      render: (_, record) => (
        <div className='small'>
          <div>Q{record.quarter} {record.year}</div>
          <div className='text-muted'>
            {new Date(record.start_date).toLocaleDateString('id-ID')} -{' '}
            {new Date(record.end_date).toLocaleDateString('id-ID')}
          </div>
        </div>
      ),
    },
    {
      title: 'Pengurangan Alokasi',
      dataIndex: 'allocation_reduction',
      key: 'allocation_reduction',
      render: (reduction: number | null) =>
        reduction ? `${reduction}%` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size='small'>
          <Tooltip title='Detail'>
            <Button
              type='link'
              icon={<EyeOutlined />}
              onClick={() => navigate(`/vendor-sp/detail/${record.id}`)}
            />
          </Tooltip>
          {record.status === 1 && (
            <Tooltip title='Selesaikan SP'>
              <Button
                type='link'
                icon={<CheckCircleOutlined />}
                onClick={() => handleComplete(record.id)}
                danger
              />
            </Tooltip>
          )}
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
                placeholder='Cari vendor...'
                onSearch={(value) =>
                  setFilters((prev) => ({ ...prev, search: value }))
                }
                style={{ width: 250 }}
              />
              <Select
                placeholder='Level SP'
                allowClear
                style={{ width: 120 }}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, sp_level: value }))
                }
              >
                <Option value={1}>SP1</Option>
                <Option value={2}>SP2</Option>
                <Option value={3}>SP3</Option>
              </Select>
              <Select
                placeholder='Status'
                allowClear
                style={{ width: 120 }}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <Option value={1}>Aktif</Option>
                <Option value={2}>Selesai</Option>
                <Option value={3}>Diperpanjang</Option>
              </Select>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                loading={loading}
              >
                Refresh
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
    </div>
  )
}

export { ViewVendorSP }
