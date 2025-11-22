import React, { useEffect, useState } from 'react'
import { generateQr, healthCheck, logout } from '../../../helpers/wautils'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleCheck, faCircleXmark, faRotateRight} from '@fortawesome/free-solid-svg-icons'
import './ChatConfig.css'


const ChatConfig: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [errorText, setErrorText] = useState<string>('')
  const [statusDetail, setStatusDetail] = useState<string | null>(null)
  const [loadingLogout, setLoadingLogout] = useState(false)

  const [qrImage, setQrImage] = useState<string | null>(null)
  const [qrMessage, setQrMessage] = useState<string | null>(null)
  const [qrExpiresAt, setQrExpiresAt] = useState<string | null>(null)
  const [isFetchingQr, setIsFetchingQr] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const autoRefreshRef = React.useRef<number | null>(null)
  const expiresTimeoutRef = React.useRef<number | null>(null)
  const isAutoRefreshingRef = React.useRef<boolean>(false)

  const clearAutoTimers = () => {
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current)
      autoRefreshRef.current = null
    }
    if (expiresTimeoutRef.current) {
      clearTimeout(expiresTimeoutRef.current)
      expiresTimeoutRef.current = null
    }
    isAutoRefreshingRef.current = false
  }

  const checkStatus = async () => {
    setLoadingStatus(true)
    setErrorText('')
    try {
      const res = await healthCheck()
      const data: any = res.data ?? res

      // Prefer explicit waState, then clientState, then boolean connected
      const waState: string | null = (typeof data.waState === 'string' && data.waState) || (data?.data && typeof data.data.waState === 'string' && data.data.waState) || null
      const clientState: string | null = (typeof data.clientState === 'string' && data.clientState) || (data?.data && typeof data.data.clientState === 'string' && data.data.clientState) || null
      const booleanConnected = typeof data === 'boolean' ? data : (typeof data.connected === 'boolean' ? data.connected : (data?.data && typeof data.data.connected === 'boolean' ? data.data.connected : null))

      const connected = (waState && waState.toLowerCase() === 'connected') || (clientState && clientState.toLowerCase() === 'ready') || !!booleanConnected

      setIsConnected(!!connected)
      setStatusDetail(waState ?? clientState ?? null)
    } catch (e: any) {
      setIsConnected(false)
      setStatusDetail(null)
      setErrorText('Gagal memeriksa status koneksi.')
    } finally {
      setLoadingStatus(false)
    }
  }

  const handleLogout = async () => {
    setLoadingLogout(true)
    setErrorText('')
    try {
      const res = await logout()
      const ok = res && (res.status === 200 || res.status === 201 || (res.data && (res.data.success === true || res.data.connected === false)))
      if (ok) {
        // successful logout; refresh status
        await checkStatus()
      } else {
        setErrorText('Logout gagal: respons tidak berhasil')
      }
    } catch (err: any) {
      setErrorText('Gagal logout: ' + (err?.message || String(err)))
    } finally {
      setLoadingLogout(false)
    }
  }

  const fetchQr = async () => {
    setIsFetchingQr(true)
    setQrError(null)
    try {
      const res = await generateQr()
      console.log('generateQr response:', res )
      if (!res || (res.status !== 200 && res.status !== 201)) {
        throw new Error('generateQr gagal atau mengembalikan status bukan 200/201')
      }
      const payload = res.data ?? res
      const qrImg = payload.image

      if (!qrImg) {
        setQrError('QR tidak tersedia pada respons server')
        setQrImage(null)
        setQrMessage(payload.message ?? null)
        setQrExpiresAt(payload.expiresAt ?? null)
        return
      }

      setQrImage(qrImg)
      setQrMessage(payload.message ?? null)
      setQrExpiresAt(payload.expiresAt ?? null)

      // If auto-refresh is active, schedule regen 5s before expiry
      if (isAutoRefreshingRef.current && payload.expiresAt) {
        try {
          const expiresAt = new Date(payload.expiresAt).getTime()
          const msUntilRefresh = expiresAt - Date.now() - 5000
          if (msUntilRefresh > 0) {
            if (expiresTimeoutRef.current) {
              clearTimeout(expiresTimeoutRef.current)
            }
            // @ts-ignore
            expiresTimeoutRef.current = window.setTimeout(() => {
              // only fetch if still auto-refreshing and not connected
              if (isAutoRefreshingRef.current && !isConnected) fetchQr()
            }, msUntilRefresh)
          } else {
            // expires soon or already expired; fetch immediately next tick
            setTimeout(() => {
              if (isAutoRefreshingRef.current && !isConnected) fetchQr()
            }, 1000)
          }
        } catch (e) {
          // ignore scheduling errors
        }
      }
    } catch (err: any) {
      setQrError('Gagal mengambil QR: ' + (err?.message || String(err)))
      setQrImage(null)
      setQrMessage(null)

      setQrExpiresAt(null)
    } finally {
      setIsFetchingQr(false)
    }
  }

  // clear QR when connected or unmount; stop any auto-refresh
  useEffect(() => {
    if (isConnected) {
      setQrImage(null)
      setQrMessage(null)
      setQrExpiresAt(null)
      clearAutoTimers()
    }
    return () => {
      clearAutoTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  // start auto-refresh interval (every 5s) and fetch immediately
  const startAutoRefresh = () => {
    if (isAutoRefreshingRef.current) return
    isAutoRefreshingRef.current = true
    // immediate fetch
    fetchQr()
    // set interval
    // @ts-ignore
    autoRefreshRef.current = window.setInterval(() => {
      if (!isAutoRefreshingRef.current || isConnected) {
        clearAutoTimers()
        return
      }
      fetchQr()
    }, 5000)
  }

  const stopAutoRefresh = () => {
    clearAutoTimers()
  }

  useEffect(() => {
    checkStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusIcon = isConnected ? faCircleCheck : faCircleXmark
  const statusClass = isConnected ? 'connected' : 'disconnected'
  const statusText = isConnected
    ? `WhatsApp terhubung${statusDetail ? ' (' + statusDetail + ')' : ''}`
    : `WhatsApp belum terhubung${statusDetail ? ' (' + statusDetail + ')' : ''}`

  return (
    <div className='chat-config-wrapper'>
      <div className={`connection-status ${statusClass}`}>
        <FontAwesomeIcon icon={statusIcon} className='status-icon' />
        <span className='status-text'>{statusText}</span>
        <div className='ms-auto d-flex align-items-center gap-2'>
          <button className='btn btn-light btn-sm d-inline-flex align-items-center' onClick={checkStatus} disabled={loadingStatus}>
            <FontAwesomeIcon icon={faRotateRight} className='me-2' />
            {loadingStatus ? 'Memuat...' : 'Refresh Status'}
          </button>
          {isConnected && (
            <button className='btn btn-danger btn-sm d-inline-flex align-items-center' onClick={handleLogout} disabled={loadingLogout}>
              {loadingLogout ? 'Memutus...' : 'Disconnect'}
            </button>
          )}
        </div>
      </div>

      {errorText && <div className='alert alert-warning mt-3 mb-0'>{errorText}</div>}

      {/* action-row removed; manual only controls inside QR header */}

      {!isConnected ? (
        <div className='qr-and-guide mt-3'>
          <div className='qr-card'>
            <div className='qr-header d-flex align-items-center justify-content-between'>
              <div>
                <strong>QR Code Login</strong>
                <div className='text-muted small'>{qrMessage || 'Scan QR dengan WhatsApp Business untuk menghubungkan.'}</div>
              </div>
              <div>
                <div className='d-flex align-items-center gap-2'>
                  <button
                    className='btn btn-outline-secondary btn-sm'
                    onClick={() => {
                      // toggle auto-refresh
                      if (isAutoRefreshingRef.current) stopAutoRefresh()
                      else startAutoRefresh()
                    }}
                    disabled={isFetchingQr}
                  >
                    {isFetchingQr ? 'Memuat...' : isAutoRefreshingRef.current ? 'Auto Refreshing...' : 'Minta QR Baru'}
                  </button>
                  {isAutoRefreshingRef.current && (
                    <button className='btn btn-sm btn-light' onClick={stopAutoRefresh} aria-label='stop-auto'>Stop</button>
                  )}
                </div>
              </div>
            </div>

            <div className='qr-body d-flex align-items-center justify-content-center qr-body-area'>
              {qrError && <div className='text-danger'>{qrError}</div>}
              {!qrError && !qrImage && <div className='text-muted'>QR belum tersedia</div>}
              {qrImage && (
                <div className='text-center'>
                  <img src={qrImage} alt='QR code' className='qr-image' />
                  {qrExpiresAt && (
                    <div className='small text-muted mt-2'>
                      Expired: {new Date(qrExpiresAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className='guide-card'>
            <div className='guide-title'>Panduan Koneksi</div>
            <ol className='guide-list'>
              <li>
                <strong>Buka WhatsApp Business</strong>
                <div>Pastikan menggunakan aplikasi WhatsApp Business, bukan WhatsApp biasa.</div>
              </li>
              <li>
                <strong>Masuk ke Perangkat Tertaut</strong>
                <div>Menu → Perangkat Tertaut → Tautkan Perangkat Baru.</div>
              </li>
              <li>
                <strong>Pindai QR Code</strong>
                <div>Klik Connect lalu arahkan ponsel ke QR Code di atas.</div>
              </li>
              <li>
                <strong>Selesai!</strong>
                <div>Akun WhatsApp Business Anda sekarang terhubung ke sistem.</div>
              </li>
            </ol>

            <div className='note-box'>
              <div className='note-title'>Catatan Penting:</div>
              <ul>
                <li>Jika QR Code tidak dapat tersambung, pastikan anda meminta QR baru.</li>
                <li>Pastikan ponsel terhubung ke internet.</li>
                <li>Hanya satu perangkat yang dapat terhubung pada satu waktu.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className='guide-card mt-3'>
          <div className='guide-title'>Panduan Koneksi</div>
          <ol className='guide-list'>
            <li>
              <strong>Buka WhatsApp Business</strong>
              <div>Pastikan menggunakan aplikasi WhatsApp Business, bukan WhatsApp biasa.</div>
            </li>
            <li>
              <strong>Masuk ke Perangkat Tertaut</strong>
              <div>Menu → Perangkat Tertaut → Tautkan Perangkat Baru.</div>
            </li>
            <li>
              <strong>Pindai QR Code</strong>
              <div>Klik Connect lalu arahkan ponsel ke QR Code di atas.</div>
            </li>
            <li>
              <strong>Selesai!</strong>
              <div>Akun WhatsApp Business Anda sekarang terhubung ke sistem.</div>
            </li>
          </ol>

          <div className='note-box'>
            <div className='note-title'>Catatan Penting:</div>
            <ul>
              <li>Jika QR Code tidak dapat tersambung, pastikan anda meminta QR baru.</li>
              <li>Pastikan ponsel terhubung ke internet.</li>
              <li>Hanya satu perangkat yang dapat terhubung pada satu waktu.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export {ChatConfig}
