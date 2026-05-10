import React, {useState, useEffect} from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faTrash,
  faUser,
  faPhone,
  faIdCard,
  faTools,
} from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import axios from 'axios'
import type {TukangItem} from '../../hooks/useVendorRegistrationForm'

interface TukangInfoFormProps {
  tukangList: TukangItem[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, field: keyof TukangItem, value: any) => void
}

export const TukangInfoForm: React.FC<TukangInfoFormProps> = ({
  tukangList,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const animatedComponents = makeAnimated()
  const [serviceTypeOptions, setServiceTypeOptions] = useState<any[]>([])

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await axios.get(`${apiUrl}/service-type/public/list`, {
          headers: {'ngrok-skip-browser-warning': 'true'},
        })
        const data = res.data?.data?.data || res.data?.data || []
        const options = data.map((item: any) => ({
          value: item.id,
          label: item.service_type,
        }))
        setServiceTypeOptions(options)
      } catch (err) {
        console.error('Failed to load service types', err)
      }
    }
    fetchServiceTypes()
  }, [apiUrl])

  return (
    <div className='tukang-section mb-4'>
      {/* Section Header */}
      <div className='d-flex align-items-center justify-content-between mb-4'>
        <div>
          <h5 className='fw-bold mb-1'>Informasi Tukang</h5>
          <p className='text-muted mb-0' style={{fontSize: '12px'}}>
            Tambahkan data tukang yang akan bekerja dengan vendor ini
          </p>
        </div>
        <Button
          variant='primary'
          onClick={onAdd}
          className='btn btn-primary d-flex align-items-center gap-2'
          style={{padding: '8px 16px'}}
        >
          <FontAwesomeIcon icon={faPlus} />
          Tambah Tukang
        </Button>
      </div>

      {/* Empty State */}
      {tukangList.length === 0 && (
        <div
          className='text-center py-5'
          style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #e9ecef',
          }}
        >
          <FontAwesomeIcon icon={faUser} className='text-muted mb-3' style={{fontSize: '32px'}} />
          <p className='text-muted mb-0'>Belum ada tukang ditambahkan.</p>
          <p className='text-muted mb-0' style={{fontSize: '12px'}}>
            Klik "Tambah Tukang" untuk menambahkan data tukang.
          </p>
        </div>
      )}

      {/* Tukang Cards */}
      <div className='d-flex flex-column gap-3'>
        {tukangList.map((tukang, idx) => (
          <div
            key={idx}
            className='tukang-card'
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              // overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Card Header */}
            <div
              className='d-flex align-items-center justify-content-between px-4 py-3'
              style={{
                background: 'linear-gradient(135deg, #183383 0%, #1a42b8 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className='d-flex align-items-center gap-3'>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{color: '#fff', fontWeight: '600', fontSize: '14px'}}>
                  Tukang {idx + 1}
                </span>
              </div>
              <Button
                variant='link'
                onClick={() => onRemove(idx)}
                className='p-0'
                style={{color: 'rgba(255,255,255,0.7)'}}
                title='Hapus Tukang'
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>

            {/* Card Body */}
            <div className='px-4 py-4'>
              <Row className='g-3'>
                {/* Nama Lengkap */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label
                      className='mb-1'
                      style={{fontSize: '12px', fontWeight: '600', color: '#5e6278'}}
                    >
                      <FontAwesomeIcon icon={faUser} className='me-1' style={{fontSize: '10px'}} />
                      Nama Lengkap
                    </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Masukkan nama lengkap tukang'
                      value={tukang.full_name}
                      onChange={(e) => onUpdate(idx, 'full_name', e.target.value)}
                      style={{borderRadius: '8px', padding: '10px 14px'}}
                    />
                  </Form.Group>
                </Col>

                {/* No. HP */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label
                      className='mb-1'
                      style={{fontSize: '12px', fontWeight: '600', color: '#5e6278'}}
                    >
                      <FontAwesomeIcon icon={faPhone} className='me-1' style={{fontSize: '10px'}} />
                      No. HP
                    </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='08xxxxxxxxxx'
                      value={tukang.phone_number}
                      onChange={(e) => onUpdate(idx, 'phone_number', e.target.value)}
                      style={{borderRadius: '8px', padding: '10px 14px'}}
                    />
                  </Form.Group>
                </Col>

                {/* No. KTP */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label
                      className='mb-1'
                      style={{fontSize: '12px', fontWeight: '600', color: '#5e6278'}}
                    >
                      <FontAwesomeIcon
                        icon={faIdCard}
                        className='me-1'
                        style={{fontSize: '10px'}}
                      />
                      No. KTP
                    </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Nomor KTP'
                      value={tukang.ktp_number}
                      onChange={(e) => onUpdate(idx, 'ktp_number', e.target.value)}
                      style={{borderRadius: '8px', padding: '10px 14px'}}
                    />
                  </Form.Group>
                </Col>

                {/* Skill / Keahlian */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label
                      className='mb-1'
                      style={{fontSize: '12px', fontWeight: '600', color: '#5e6278'}}
                    >
                      <FontAwesomeIcon icon={faTools} className='me-1' style={{fontSize: '10px'}} />
                      Skill / Keahlian
                    </Form.Label>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      menuPortalTarget={document.body}
                      menuPosition='absolute' // ← ganti
                      maxMenuHeight={200} // ← tambah
                      classNamePrefix='select'
                      placeholder='Pilih keahlian...'
                      options={serviceTypeOptions}
                      components={animatedComponents}
                      value={serviceTypeOptions.filter((opt) =>
                        (tukang.service_type_id || []).includes(opt.value)
                      )}
                      onChange={(selected: any) =>
                        onUpdate(
                          idx,
                          'service_type_id',
                          selected.map((s: any) => s.value)
                        )
                      }
                      styles={{
                        menuPortal: (base) => ({...base, zIndex: 9999}), // ← tambah
                        control: (base) => ({
                          ...base,
                          borderRadius: '8px',
                          padding: '2px 4px',
                          fontSize: '13px',
                        }),
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Selected Skills Tags */}
              {(tukang.service_type_id || []).length > 0 && (
                <div className='mt-3 d-flex flex-wrap gap-2'>
                  {serviceTypeOptions
                    .filter((opt) => (tukang.service_type_id || []).includes(opt.value))
                    .map((opt) => (
                      <span
                        key={opt.value}
                        className='d-inline-flex align-items-center gap-1 px-2 py-1'
                        style={{
                          background: 'rgba(24, 51, 131, 0.08)',
                          color: '#183383',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        {opt.label}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
