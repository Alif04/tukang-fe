import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const apiUrl = process.env.REACT_APP_API_CHAT_URL || process.env.REACT_APP_API_URL || '';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const OfficeHours = () => {
  const [officeHours, setOfficeHours] = useState(
    days.map((day) => ({
      day,
      isOpen: day !== 'Sunday',
      openTime: '07:00',
      closeTime: '17:00',
    }))
  );

  useEffect(() => {
    const fetch = async () => {
      if (!apiUrl) {
        message.error('Gagal mengambil data office hours: konfigurasi server tidak ditemukan')
        return
      }
      try {
        const res = await axios.get(`${apiUrl}/office-hours`)
        // Accept common response shapes
        const data = res?.data?.data ?? res?.data ?? null
        if (Array.isArray(data) && data.length > 0) {
          // dedupe by day to avoid duplicate keys
          const map:any = {}
          data.forEach((d:any) => {
            const key = d.day || d.name || `${d?.dayName || ''}`
            if (key) map[key] = d
          })
          const deduped = days.map((day) => map[day] ?? map[day?.toLowerCase?.()] ?? map[day?.toUpperCase?.()] ?? { day, isOpen: day !== 'Sunday', openTime: '07:00', closeTime: '17:00' })
          setOfficeHours(deduped)
        } else if (data && typeof data === 'object') {
          // If API returns object keyed by day
          const mapped = days.map((day) => {
            const found = (Array.isArray(data) ? data : Object.values(data)).find((d:any) => d.day === day || d.name === day)
            return (
              found ?? {
                day,
                isOpen: day !== 'Sunday',
                openTime: '07:00',
                closeTime: '17:00',
              }
            )
          })
          setOfficeHours(mapped)
        } else {
          // keep defaults but notify
          message.error('Gagal mengambil data office hours: data tidak valid')
          console.error('Invalid office hours response', res.data)
        }
      } catch (err: any) {
        // If server does not implement office-hours endpoint, silently continue with defaults
        if (err && err.response && err.response.status === 404) {
          console.warn('Office hours endpoint not found (404) - using defaults')
          // optional: notify as info instead of error
          // message.info('Office hours belum tersedia di server; menggunakan pengaturan default')
          return
        }
        console.error('Gagal mengambil data office hours', err)
        message.error('Gagal mengambil data office hours')
      }
    }

    fetch()
  }, []);

  const handleChange = (index:any, field:any, value:any) => {
    setOfficeHours((prev:any) =>
      prev.map((item:any, i:number) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    if (!apiUrl) {
      message.error('Konfigurasi server tidak ditemukan')
      return
    }
    try {
      await axios.post(`${apiUrl}/office-hours`, { officeHours })
      message.success('Office hours saved successfully!')
    } catch (err: any) {
      if (err && err.response && err.response.status === 404) {
        console.warn('Office hours save endpoint not found (404); skipping save')
        message.error('Gagal menyimpan: endpoint tidak ditemukan pada server')
        return
      }
      console.error('Failed to save office hours', err)
      message.error('Failed to save office hours')
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '24px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Office Hours</h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
        Admin dapat mengatur jam operasional layanan sesuai dengan kebijakan perusahaan.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {officeHours.map((item:any, index:number) => (
          <div key={`${item.day ?? 'day'}-${index}`} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type='checkbox'
                checked={item.isOpen}
                onChange={(e) => handleChange(index, 'isOpen', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{item.day}</span>
            </div>
            {item.isOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type='time'
                  value={item.openTime}
                  onChange={(e) => handleChange(index, 'openTime', e.target.value)}
                  style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '14px' }}>to</span>
                <input
                  type='time'
                  value={item.closeTime}
                  onChange={(e) => handleChange(index, 'closeTime', e.target.value)}
                  style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            ) : (
              <span style={{ color: 'red', fontSize: '14px' }}>Closed</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
          }}
          onMouseEnter={(e:any) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e:any) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onClick={handleSave}
        >
          Save Office Hours
        </button>
      </div>
    </div>
  );
};

export { OfficeHours };
