import React, {useEffect, useState} from 'react'
import {Button, Card, Input, Modal, Select, Space, Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {vendorViolationService} from '../../../services/vendorViolationService'
import Swal from 'sweetalert2'
import {CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined} from '@ant-design/icons'
import {
  VendorSpActionButton,
  VendorSpPill,
  vendorSpPagination,
  vendorSpTableClassName,
} from './VendorSpTable'

const {Option} = Select

const VendorViolationRevisionRequests: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | undefined>('PENDING')
  const [reviewTarget, setReviewTarget] = useState<any>(null)
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await vendorViolationService.getRevisionRequests({
        take: 100,
        ...(status ? {status} : {}),
      })
      setData(response.data?.data || response.data || [])
    } catch (error) {
      Swal.fire('Error', 'Gagal mengambil request revisi/reset', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const openReview = (record: any, action: 'APPROVE' | 'REJECT') => {
    setReviewTarget(record)
    setReviewAction(action)
    setReviewNote('')
  }

  const submitReview = async () => {
    if (!reviewTarget || !reviewAction) return

    setSubmitting(true)
    try {
      if (reviewAction === 'APPROVE') {
        await vendorViolationService.approveRevisionRequest(reviewTarget.id, {
          review_note: reviewNote,
        })
      } else {
        await vendorViolationService.rejectRevisionRequest(reviewTarget.id, {
          review_note: reviewNote,
        })
      }

      Swal.fire('Berhasil', 'Request berhasil direview', 'success')
      setReviewTarget(null)
      setReviewAction(null)
      fetchData()
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Gagal review request', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID'),
    },
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_, record) => (
        <div>
          <div className='fw-bold'>{record.vendor?.company_name || '-'}</div>
          <div className='text-muted small'>{record.vendor?.pic_name || '-'}</div>
        </div>
      ),
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => (
        <VendorSpPill color={value === 'RESET' ? 'red' : 'blue'}>{value}</VendorSpPill>
      ),
    },
    {
      title: 'Target',
      key: 'target',
      render: (_, record) =>
        record.target_log ? (
          <span>
            #{record.target_log.id} - {record.target_log.violation_type?.name || '-'}
          </span>
        ) : (
          <span className='text-muted'>Quarter berjalan</span>
        ),
    },
    {
      title: 'Poin Baru',
      dataIndex: 'new_point',
      key: 'new_point',
      render: (value: number | null) => (value === null || value === undefined ? '-' : value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <VendorSpPill color={value === 'APPROVED' ? 'green' : value === 'REJECTED' ? 'red' : 'gold'}>
          {value}
        </VendorSpPill>
      ),
    },
    {
      title: 'Alasan',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) =>
        record.status === 'PENDING' ? (
          <Space>
            <VendorSpActionButton
              title='Approve'
              tone='success'
              icon={<CheckCircleOutlined />}
              onClick={() => openReview(record, 'APPROVE')}
            />
            <VendorSpActionButton
              title='Reject'
              tone='danger'
              icon={<CloseCircleOutlined />}
              onClick={() => openReview(record, 'REJECT')}
            />
          </Space>
        ) : (
          <span className='text-muted'>{record.review_note || '-'}</span>
        ),
    },
  ]

  return (
    <Card
      className='vendor-sp-table'
      title='Approval Revisi / Reset Poin Vendor'
      extra={
        <Space className='vendor-sp-action-group'>
          <Select
            className='vendor-sp-filter-control'
            value={status}
            allowClear
            placeholder='Semua status'
            style={{width: 180}}
            onChange={(value) => setStatus(value)}
          >
            <Option value='PENDING'>PENDING</Option>
            <Option value='APPROVED'>APPROVED</Option>
            <Option value='REJECTED'>REJECTED</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
        </Space>
      }
    >
      <Table
        className={vendorSpTableClassName}
        rowKey='id'
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={vendorSpPagination({pageSize: 10})}
        scroll={{x: 1000}}
      />

      <Modal
        title={`${reviewAction === 'APPROVE' ? 'Approve' : 'Reject'} Request`}
        open={Boolean(reviewTarget)}
        onCancel={() => setReviewTarget(null)}
        onOk={submitReview}
        confirmLoading={submitting}
      >
        <p className='mb-2'>
          {reviewTarget?.type} untuk vendor {reviewTarget?.vendor?.company_name || '-'}
        </p>
        <Input.TextArea
          rows={3}
          value={reviewNote}
          placeholder='Catatan review'
          onChange={(event) => setReviewNote(event.target.value)}
        />
      </Modal>
    </Card>
  )
}

export {VendorViolationRevisionRequests}
