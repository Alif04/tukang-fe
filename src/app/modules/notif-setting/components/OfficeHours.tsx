import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { message } from 'antd'
import 'bootstrap/dist/css/bootstrap.min.css'

const apiUrl = process.env.REACT_APP_API_CHAT_URL

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface OfficeHour {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

const OfficeHours: React.FC = () => {
  const [officeHours, setOfficeHours] = useState<OfficeHour[]>(
    days.map((day) => ({
      day,
      isOpen: day !== 'Sunday',
      openTime: '07:00',
      closeTime: '17:00',
    }))
  )

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    axios
      .get(`${apiUrl}/office-hours`)
      .then((res) => setOfficeHours(res.data))
      .catch(() => console.error('Gagal mengambil data office hours'))
  }, [])

  // Handle perubahan nilai input
  const handleChange = (index: number, field: keyof OfficeHour, value: any) => {
    setOfficeHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  // Simpan ke backend
  const handleSave = () => {
    axios
      .post(`${apiUrl}/office-hours`, { officeHours })
      .then(() => message.success('Office hours saved successfully!'))
      .catch(() => message.error('Failed to save office hours'))
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Office Hours</h4>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Admin dapat mengatur jam operasional layanan sesuai dengan kebijakan perusahaan.
          </p>

          <div className="row">
            {officeHours.map((item, index) => (
              <div key={item.day} className="col-md-6 mb-3">
                <div className="d-flex align-items-center border rounded p-2">
                  <input
                    type="checkbox"
                    checked={item.isOpen}
                    onChange={(e) => handleChange(index, 'isOpen', e.target.checked)}
                    className="me-2 form-check-input"
                  />
                  <label className="fw-bold flex-grow-1">{item.day}</label>

                  {item.isOpen ? (
                    <div className="d-flex align-items-center">
                      <input
                        type="time"
                        value={item.openTime}
                        onChange={(e) => handleChange(index, 'openTime', e.target.value)}
                        className="form-control form-control-sm me-2"
                        style={{ width: '100px' }}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={item.closeTime}
                        onChange={(e) => handleChange(index, 'closeTime', e.target.value)}
                        className="form-control form-control-sm ms-2"
                        style={{ width: '100px' }}
                      />
                    </div>
                  ) : (
                    <span className="text-danger ms-2">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-end mt-3">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Office Hours
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export {OfficeHours}
