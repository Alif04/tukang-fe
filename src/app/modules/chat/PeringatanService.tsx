import React, { useMemo, useState } from 'react'
import { sendWaMessage } from '../../helpers/wautils'
import { PageTitle } from '../../../_metronic/layout/core'

interface Broadcast {
  id: string
  targetNumber: string
  message: string
  createdAt: string
  status: 'Terkirim' | 'Pending'
}

const dummyCustomers = [
  { id: '6285210275004', name: 'Dayat', phone: '+6285210275004' },
  { id: '6289988776655', name: 'Siti Aisyah', phone: '+6289988776655' },
  { id: '6281234567890', name: 'Andi Wijaya', phone: '+6281234567890' },
]

const PeringatanService: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [customerQuery, setCustomerQuery] = useState('')
  const pushLog = (msg: string) => {
    try {
      // keep browser console
      // eslint-disable-next-line no-console
      console.log(new Date().toLocaleTimeString() + ' — ' + msg)
    } catch (e) {}
  }

  const normalizeNumber = (input: string) => {
    let s = input.trim()
    // keep digits and plus
    s = s.replace(/[^\d+]/g, '')
    // convert leading 0 to 62
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
    return dummyCustomers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
      c.id.includes(q)
    )
  }, [customerQuery])

  const addBroadcast = async () => {
    pushLog('addBroadcast called; selectedCustomers=' + JSON.stringify(selectedCustomers) + ' message=' + (message ? '[filled]' : '[empty]'))

    if (!selectedCustomers.length || !message.trim()) {
      pushLog('addBroadcast aborted: missing customers or message')
      // keep simple UX for now
      // eslint-disable-next-line no-alert
      alert('Pilih minimal 1 customer dan isi pesan')
      return
    }

    const now = new Date()
    const createdAt = now.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

    const newItems: Broadcast[] = selectedCustomers.map((custId) => {
      const c = dummyCustomers.find((d) => d.id === custId)
      return { id: `${custId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, targetNumber: c ? c.phone : custId, message, createdAt, status: 'Pending' }
    })

    // show pending immediately
    setBroadcasts((prev) => [...newItems, ...prev])
    setIsSending(true)

    // Konfigurasi WA (URL dan header) kini dikelola global di helper sendWaMessage.
  pushLog('Konfigurasi WA menggunakan environment variables (global)')

    try {
      const tasks = newItems.map(async (item) => {
        const payload = { number: item.targetNumber.replace(/\D/g, ''), message: item.message }
        pushLog('➡️ Sending: ' + JSON.stringify(payload))
        try {
          const resp = await sendWaMessage(payload)
          pushLog('✅ API Response ' + resp.status)
          if (resp.status === 200 || resp.status === 201) {
            setBroadcasts((prev) => prev.map((b) => (b.id === item.id ? { ...b, status: 'Terkirim' } : b)))
          }
          return resp
        } catch (err: any) {
          pushLog('❌ Error sending broadcast: ' + (err?.message || String(err)))
          // ensure caller sees failure
          throw err
        }
      })

      const results = await Promise.allSettled(tasks)
      pushLog('allSettled done; results=' + JSON.stringify(results.map((r) => (r && (r as any).status) || r)))
    } catch (err: any) {
      pushLog('❌ Global error while sending: ' + (err?.message || String(err)))
    }

    // reset form
    setSelectedCustomers([])
    setMessage('')
    setCustomerQuery('')
    setShowAdd(false)
    setIsSending(false)
  }

  return (
    <div>
      <PageTitle breadcrumbs={[]}>Peringatan Service</PageTitle>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">List Transaksi / Broadcast</h3>
          <div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add Broadcast</button>
          </div>
        </div>

        <div className="card-body">
          {broadcasts.length === 0 ? (
            <div className="text-center text-muted">Belum ada broadcast</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
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
                  {broadcasts.map((b, idx) => (
                    <tr key={b.id}>
                      <td>{idx + 1}</td>
                      <td>{b.targetNumber}</td>
                      <td style={{ maxWidth: 400 }}>{b.message}</td>
                      <td>{b.createdAt}</td>
                      <td>{b.status === 'Terkirim' ? <span className="badge bg-success">{b.status}</span> : <span className="badge bg-warning">{b.status}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={async (e) => { e.preventDefault(); await addBroadcast() }}>
              <div className="modal-header">
                <h5 className="modal-title">Add Broadcast</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdd(false)}></button>
              </div>
              <div className="modal-body position-relative">
                <div className="mb-3">
                  <label className="form-label">Pilih atau ketik nomor pelanggan</label>
                  <div className="d-flex">
                    <input className="form-control" placeholder="Cari nama atau nomor pelanggan" value={customerQuery} onChange={(e) => setCustomerQuery(e.target.value)} onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const q = customerQuery.trim()
                        const match = dummyCustomers.find((d) => d.phone === q || d.id === q || d.phone.replace(/\D/g, '') === q.replace(/\D/g, ''))
                        if (match) addCustomerById(match.id)
                        else if (q) addCustomerById(normalizeNumber(q))
                      }
                    }} />
                    <button type="button" className="btn btn-outline-primary ms-2" disabled={!customerQuery.trim()} onClick={() => {
                      const q = customerQuery.trim(); if (!q) return; const match = dummyCustomers.find((d) => d.phone === q || d.id === q || d.phone.replace(/\D/g, '') === q.replace(/\D/g, '')); if (match) addCustomerById(match.id); else addCustomerById(normalizeNumber(q))
                    }}>Tambahkan</button>
                  </div>
                  {filteredSuggestions.length > 0 && (
                    <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1050, maxHeight: 200, overflow: 'auto' }}>
                      {filteredSuggestions.map((s) => (
                        <li key={s.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => addCustomerById(s.id)}>
                          <div className="d-flex justify-content-between"><div><strong>{s.name}</strong><div className="text-muted small">{s.phone}</div></div><div className="text-muted small">Pilih</div></div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-2">
                    {selectedCustomers.map((cid) => { const c = dummyCustomers.find((d) => d.id === cid); return (
                      <span key={cid} className="badge bg-secondary me-2 mb-2">{c ? `${c.name} — ${c.phone}` : cid}
                        <button type="button" className="btn btn-sm btn-close ms-2" onClick={() => removeSelectedCustomer(cid)} style={{ verticalAlign: 'middle' }} />
                      </span>
                    )})}
                  </div>
                  <div className="form-text">Tekan Enter untuk menambahkan nomor jika tidak ada di daftar.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Pesan</label>
                  <textarea className="form-control" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" disabled={isSending} onClick={() => setShowAdd(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={isSending}>{isSending ? 'Mengirim...' : 'Kirim (simpan)'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default PeringatanService
