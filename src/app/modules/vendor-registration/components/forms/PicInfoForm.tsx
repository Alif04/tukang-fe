import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
}

export const PicInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [banks, setBanks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bank/public/list`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (Array.isArray(response.data.data?.data)) {
          setBanks(response.data.data.data.map((item: any) => ({ value: item.id, label: item.bank_name })));
        }
      } catch (err) {
        console.error('Failed to load banks', err);
      }
    };
    fetchBanks();
  }, [apiUrl]);

  return (
    <>
      <hr className="my-4" />
      <h5 className="mb-4 fw-bold">Informasi Penanggung Jawab (PIC)</h5>

      <Row className="form-body mb-3">
        <Col>
          <Form.Group>
            <Form.Label style={{ fontWeight: 500 }}>Nama PIC</Form.Label>
            <Form.Control
              type="text"
              value={data.pic_name}
              onChange={(e) => onChange('pic_name', e.target.value)}
              placeholder="Nama penanggung jawab"
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label style={{ fontWeight: 500 }}>Nomor HP / WA PIC</Form.Label>
            <Form.Control
              type="text"
              value={data.pic_phone}
              onChange={(e) => onChange('pic_phone', e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="form-body mb-3">
        <Form.Group>
          <Form.Label style={{ fontWeight: 500 }}>Email PIC</Form.Label>
          <Form.Control
            type="email"
            value={data.pic_email}
            onChange={(e) => onChange('pic_email', e.target.value)}
            placeholder="email@pic.com"
          />
        </Form.Group>
      </Row>

      <Row className="form-body mb-3">
        <Col>
          <Form.Group>
            <Form.Label style={{ fontWeight: 500 }}>Nomor KTP (Opsional)</Form.Label>
            <Form.Control
              type="text"
              value={data.ktp_number}
              onChange={(e) => onChange('ktp_number', e.target.value)}
              placeholder="Nomor KTP"
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label style={{ fontWeight: 500 }}>Nomor NPWP (Opsional)</Form.Label>
            <Form.Control
              type="text"
              value={data.npwp_number}
              onChange={(e) => onChange('npwp_number', e.target.value)}
              placeholder="Nomor NPWP"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="form-body mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontWeight: 500 }}>Bank (Opsional)</Form.Label>
            <Select
              classNamePrefix="select"
              placeholder="Pilih Nama Bank"
              isSearchable
              isClearable
              options={banks}
              onChange={(element: any) => onChange('bank_id', element?.value || null)}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};
