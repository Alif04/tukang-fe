import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const apiUrl = process.env.REACT_APP_API_CHAT_URL;

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
    axios
      .get(`${apiUrl}/office-hours`)
      .then((res) => setOfficeHours(res.data))
      .catch(() => console.error('Gagal mengambil data office hours'));
  }, []);

  const handleChange = (index:any, field:any, value:any) => {
    setOfficeHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    axios
      .post(`${apiUrl}/office-hours`, { officeHours })
      .then(() => message.success('Office hours saved successfully!'))
      .catch(() => message.error('Failed to save office hours'));
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '24px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Office Hours</h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
        Admin dapat mengatur jam operasional layanan sesuai dengan kebijakan perusahaan.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {officeHours.map((item, index) => (
          <div key={item.day} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onClick={handleSave}
        >
          Save Office Hours
        </button>
      </div>
    </div>
  );
};

export { OfficeHours };