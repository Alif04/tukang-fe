import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Form, Button, Card } from 'react-bootstrap';
import { publicVendorService } from '../../services/vendorRegistrationService';

import { useVendorRegistrationForm } from './hooks/useVendorRegistrationForm';
import { CompanyInfoForm } from './components/forms/CompanyInfoForm';
import { PicInfoForm } from './components/forms/PicInfoForm';
import { DocumentUploadForm } from './components/forms/DocumentUploadForm';
import { TukangInfoForm } from './components/forms/TukangInfoForm';

import '../../components/admin-ho/vendor/new_vendor/NewVendor.css';

const VendorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { formData, images, tukangList, updateField, updateImage, addTukang, removeTukang, updateTukang } = useVendorRegistrationForm();

  const validateForm = () => {
    let valid = true;

    if (!formData.company_name) {
      Swal.fire({ title: 'Warning', text: 'Nama Perusahaan wajib diisi', icon: 'warning' });
      valid = false;
    } else if (!formData.pic_name) {
      Swal.fire({ title: 'Warning', text: 'Nama PIC wajib diisi', icon: 'warning' });
      valid = false;
    } else if (!formData.pic_phone) {
      Swal.fire({ title: 'Warning', text: 'Nomor HP PIC wajib diisi', icon: 'warning' });
      valid = false;
    } else if (!formData.email_address) {
      Swal.fire({ title: 'Warning', text: 'Email wajib diisi', icon: 'warning' });
      valid = false;
    } else if (!formData.pic_email) {
      Swal.fire({ title: 'Warning', text: 'Email PIC wajib diisi', icon: 'warning' });
      valid = false;
    } else if (!formData.phone_number) {
      Swal.fire({ title: 'Warning', text: 'Nomor HP Perusahaan wajib diisi', icon: 'warning' });
      valid = false;
    } else if (!formData.areas || formData.areas.length === 0) {
      Swal.fire({ title: 'Warning', text: 'Service Area wajib dipilih', icon: 'warning' });
      valid = false;
    } else if (!formData.service_types || formData.service_types.length === 0) {
      Swal.fire({ title: 'Warning', text: 'Service Type wajib dipilih', icon: 'warning' });
      valid = false;
    } else if (!formData.address) {
      Swal.fire({ title: 'Warning', text: 'Alamat wajib diisi', icon: 'warning' });
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();

      // Basic info
      submitData.append('company_name', formData.company_name);
      submitData.append('address', formData.address);
      submitData.append('phone_number', formData.phone_number);
      submitData.append('email_address', formData.email_address);
      submitData.append('pic_name', formData.pic_name);
      submitData.append('pic_email', formData.pic_email);
      submitData.append('pic_phone', formData.pic_phone);

      // Optional fields
      if (formData.ktp_number) submitData.append('ktp_number', formData.ktp_number);
      if (formData.npwp_number) submitData.append('npwp_number', formData.npwp_number);
      if (formData.bank_id) submitData.append('bank_id', String(formData.bank_id));

      // Arrays
      if (formData.areas.length > 0) {
        submitData.append('areas', JSON.stringify(formData.areas));
      }
      if (formData.service_types.length > 0) {
        submitData.append('service_types', JSON.stringify(formData.service_types));
      }

      // Images
      if (images.vendor_image?.file) submitData.append('vendor_photo', images.vendor_image.file, images.vendor_image.fileName);
      if (images.ktp_image?.file) submitData.append('ktp_photo', images.ktp_image.file, images.ktp_image.fileName);
      if (images.npwp_image?.file) submitData.append('npwp_photo', images.npwp_image.file, images.npwp_image.fileName);
      if (images.compro_image?.file) submitData.append('compro_photo', images.compro_image.file, images.compro_image.fileName);
      if (images.surat_permohonan_image?.file) submitData.append('surat_permohonan_photo', images.surat_permohonan_image.file, images.surat_permohonan_image.fileName);
      if (images.pks_image?.file) submitData.append('pks_photo', images.pks_image.file, images.pks_image.fileName);
      if (images.siup_image?.file) submitData.append('siup_photo', images.siup_image.file, images.siup_image.fileName);

      // Tukang data
      if (tukangList.length > 0) {
        submitData.append('tukang_data', JSON.stringify(tukangList));
      }

      await publicVendorService.register(submitData);

      Swal.fire({
        title: 'Success',
        text: 'Pendaftaran berhasil disubmit! Mohon tunggu konfirmasi dari admin.',
        icon: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran',
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="new-vendor" style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card style={{ borderRadius: '16px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: 'none', overflow: 'hidden' }}>
        <Card.Header style={{ backgroundColor: '#020080', borderBottom: '1px solid #020080', padding: '15px 25px' }}>
          <Card.Title style={{ color: '#fff', marginBottom: 0, fontWeight: 600 }}>
            Pendaftaran Vendor Baru
          </Card.Title>
        </Card.Header>

        <Card.Body style={{ padding: '30px' }}>
          <Form onSubmit={handleSubmit}>
            <CompanyInfoForm data={formData} onChange={updateField} />
            <PicInfoForm data={formData} onChange={updateField} />
            <TukangInfoForm
              tukangList={tukangList}
              onAdd={addTukang}
              onRemove={removeTukang}
              onUpdate={updateTukang}
            />
            <DocumentUploadForm images={images} onChange={updateImage} />

            <div className="d-flex justify-content-center mt-5">
              <Button
                className="px-5 py-2"
                style={{ backgroundColor: '#020080', border: 'none', borderRadius: '8px', fontWeight: 600 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : 'Daftar Sekarang'}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-4">
            <Link to="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
              Sudah punya akun? <strong style={{ color: '#020080' }}>Login</strong>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};

export default VendorRegisterPage;