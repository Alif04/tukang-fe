import React, {useEffect, useMemo, useState} from 'react'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import './PeringatanService.css'

interface BroadcastApiEntry {
  detail_id: number
  broadcast_id: number | null
  message: string | null
  phonenumber: string
  status: string
  CreatedAt: string
  CreatedBy: string
  status_label: string
}

const dummyCustomers = [
  {id: '6285210275004', name: 'Dayat', phone: '+6285210275004'},
  {id: '628119901612', name: 'Dony', phone: '+628119901612'},
]

const PeringatanService: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [customerQuery, setCustomerQuery] = useState('')

  // API state
  const [apiData, setApiData] = useState<BroadcastApiEntry[]>([])
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const pushLog = (msg: string) => {
    try {
      // eslint-disable-next-line no-console
      console.log(new Date().toLocaleTimeString() + ' — ' + msg)
    } catch (_) {}
  }

  const normalizeNumber = (input: string) => {
    let s = input.trim()
    s = s.replace(/[^\d+]/g, '')
    if (/^0\d+/.test(s)) s = '62' + s.replace(/^0+/, '')
    if (s.startsWith('+')) s = s.slice(1)
    return s
  }

  const addCustomerById = (custId: string) => {
    if (!selectedCustomers.includes(custId)) setSelectedCustomers((s) => [...s, custId])
    setCustomerQuery('')
  }

  const removeSelectedCustomer = (custId: string) => {
    setSelectedCustomers((s) => s.filter((id) => id !== custId))
  }

  const filteredSuggestions = useMemo(() => {
    const q = customerQuery.trim().toLowerCase()
    if (!q) return []
    return dummyCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        c.id.includes(q)
    )
  }, [customerQuery])

  const fetchBroadcasts = async () => {
    setApiLoading(true)
    setApiError(null)
    try {
      const resp = await axios.get(`${process.env.REACT_APP_WA_BACKEND_API_URL}/broadcast`)
      if (resp?.data?.status && Array.isArray(resp.data.data)) {
        setApiData(resp.data.data as BroadcastApiEntry[])
      } else {
        setApiError('Response tidak sesuai')
      }
    } catch (err: any) {
      setApiError(err?.message || 'Gagal memuat data')
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    fetchBroadcasts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addBroadcast = async () => {
    pushLog(
      'addBroadcast called; selectedCustomers=' +
        JSON.stringify(selectedCustomers) +
        ' message=' +
        (message ? '[filled]' : '[empty]')
    )

    if (!selectedCustomers.length || !message.trim()) {
      pushLog('addBroadcast aborted: missing customers or message')
      alert('Pilih minimal 1 customer dan isi pesan')
      return
    }

    const phoneNumbers = selectedCustomers.map((n) => normalizeNumber(n))

    const payload = {
      message,
      phoneNumbers,
    }

    setIsSending(true)

    try {
      pushLog('POST /broadcast payload=' + JSON.stringify(payload))
      const resp = await axios.post(`${process.env.REACT_APP_WA_BACKEND_API_URL}/broadcast`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (resp.status === 200 || resp.status === 201) {
        pushLog('Broadcast sent, reloading list')
        setShowAdd(false)
        setSelectedCustomers([])
        setMessage('')
        fetchBroadcasts()
      } else {
        throw new Error('Unexpected status: ' + resp.status)
      }
    } catch (err: any) {
      pushLog('Error sending broadcast: ' + (err?.message || String(err)))
      // user-visible error
      // eslint-disable-next-line no-alert
      alert('Gagal mengirim broadcast: ' + (err?.message || String(err)))
    } finally {
      setIsSending(false)
    }
  }

  const renderStatusBadge = (status: string, label: string) => {
    const s = (status || '').toLowerCase()
    const cls = s === 'sent' || s === 'terkirim' ? 'bg-success' : s === 'failed' ? 'bg-danger' : 'bg-secondary'
    return <span className={`badge ${cls}`}>{label || status}</span>
  }

  return (
    <div>
      <PageTitle breadcrumbs={[]}>Peringatan Service</PageTitle>

      {/* API list */}
      <div className='card'>
        <div className='card-header d-flex justify-content-between align-items-center'>
          <h3 className='card-title mb-0'>Riwayat Broadcast (API)</h3>
          <div>
            <button className='btn btn-primary' onClick={() => setShowAdd(true)} disabled={isSending}>
              {isSending ? 'Mengirim...' : 'Add Broadcast'}
            </button>
          </div>
        </div>
        <div className='card-body'>
          {apiError ? (
            <div className='alert alert-danger mb-0'>Gagal memuat: {apiError}</div>
          ) : apiLoading ? (
            <div className='text-muted'>Memuat data...</div>
          ) : apiData.length === 0 ? (
            <div className='text-center text-muted'>Data tidak ditemukan</div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nomor Tujuan</th>
                    <th>Pesan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.map((row, idx) => (
                    <tr key={row.detail_id}>
                      <td>{idx + 1}</td>
                      <td>{row.phonenumber}</td>
                      <td className='broadcast-message-cell'>{row.message || '-'}</td>
                      <td>{row.CreatedAt}</td>
                      <td>{renderStatusBadge(row.status, row.status_label)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating broadcast */}
      {showAdd && (
        <div className='modal show d-block modal-overlay-backdrop'>
          <div className='modal-dialog'>
            <form
              className='modal-content'
              onSubmit={async (e) => {
                e.preventDefault()
                await addBroadcast()
              }}
            >
              <div className='modal-header'>
                <h5 className='modal-title'>Add Broadcast</h5>
                <button type='button' className='btn-close' onClick={() => setShowAdd(false)}></button>
              </div>
              <div className='modal-body position-relative'>
                <div className='mb-3'>
                  <label className='form-label'>Pilih atau ketik nomor pelanggan</label>
                  <div className='d-flex'>
                    <input
                      className='form-control'
                      placeholder='Cari nama atau nomor pelanggan'
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const q = customerQuery.trim()
                          const match = dummyCustomers.find(
                            (d) =>
                              d.phone === q ||
                              d.id === q ||
                              d.phone.replace(/\D/g, '') === q.replace(/\D/g, '')
                          )
                          if (match) addCustomerById(match.id)
                          else if (q) addCustomerById(normalizeNumber(q))
                        }
                      }}
                    />
                    <button
                      type='button'
                      className='btn btn-outline-primary ms-2'
                      disabled={!customerQuery.trim()}
                      onClick={() => {
                        const q = customerQuery.trim()
                        if (!q) return
                        const match = dummyCustomers.find(
                          (d) =>
                            d.phone === q ||
                            d.id === q ||
                            d.phone.replace(/\D/g, '') === q.replace(/\D/g, '')
                        )
                        if (match) addCustomerById(match.id)
                        else addCustomerById(normalizeNumber(q))
                      }}
                    >
                      Tambahkan
                    </button>
                  </div>
                  {filteredSuggestions.length > 0 && (
                    <ul className='list-group position-absolute w-100 shadow-sm suggestions-dropdown-menu'>
                      {filteredSuggestions.map((s) => (
                        <li
                          key={s.id}
                          className='list-group-item list-group-item-action clickable'
                          onClick={() => addCustomerById(s.id)}
                        >
                          <div className='d-flex justify-content-between'>
                            <div>
                              <strong>{s.name}</strong>
                              <div className='text-muted small'>{s.phone}</div>
                            </div>
                            <div className='text-muted small'>Pilih</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className='mt-2'>
                    {selectedCustomers.map((cid) => {
                      const c = dummyCustomers.find((d) => d.id === cid)
                      return (
                        <span key={cid} className='badge bg-secondary me-2 mb-2'>
                          {c ? `${c.name} — ${c.phone}` : cid}
                          <button
                            type='button'
                            className='btn btn-sm btn-close ms-2 align-middle-fix'
                            onClick={() => removeSelectedCustomer(cid)}
                          />
                        </span>
                      )
                    })}
                  </div>
                  <div className='form-text'>
                    Tekan Enter untuk menambahkan nomor jika tidak ada di daftar.
                  </div>
                </div>

                <div className='mb-3'>
                  <label className='form-label'>Pesan</label>
                  <textarea
                    className='form-control'
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  disabled={isSending}
                  onClick={() => setShowAdd(false)}
                >
                  Batal
                </button>
                <button type='submit' className='btn btn-primary' disabled={isSending}>
                  {isSending ? 'Mengirim...' : 'Kirim (simpan)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PeringatanService
