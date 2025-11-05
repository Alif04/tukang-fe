import React, {useState, useEffect} from 'react'
import {Table, Tag, Input, Button, Modal, Form, message, Select, Checkbox, Upload} from 'antd'
import {EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons'
import axios from 'axios'
import Swal from 'sweetalert2'

const {Search, TextArea} = Input
const {Option} = Select
const apiUrl = process.env.REACT_APP_API_CHAT_URL || process.env.REACT_APP_API_URL || ''

const TemplateChat: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [header, setHeader] = useState<any>('')
  const [content, setContent] = useState<any>('')
  const [category, setCategory] = useState('')
  const [withImage, setWithImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [reminderTime, setReminderTime] = useState(null)
  const [subCategory, setSubCategory] = useState('')
  const [isOperationalHours, setIsOperationalHours] = useState(false)
  const subCategoryOptions = [
    'Dipesan',
    'Permintaan Survei',
    'Mulai Survei',
    'Survei Selesai',
    'Permintaan Survei Ulang',
    'Mulai Survei Ulang',
    'Survei Ulang Selesai',
    'Quotation dikirim ke HO',
    'Quotation dikirim ke Customers',
    'Permintaan Perintah Kerja',
    'Perintah Kerja Dimulai',
    'Pekerjaan Sedang Berlangsung',
    'Perintah Kerja Berakhir',
    'Permintaan Pengerjaan Ulang',
    'Pengerjaan Ulang Mulai',
    'Pengerjaan Ulang Selesai',
    'Tukang ditugaskan untuk survey',
    'Tukang ditugaskan untuk pengerjaan',
    'Penjadwalan ulang disetujui vendor',
    'Penjadwalan ulang ditolak vendor',
    'Tukang ditugaskan survei ulang',
  ]
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const {data} = await axios.get(`${apiUrl}/templates`)
      setTemplates(data)
    } catch (error) {
      message.error('Gagal mengambil data template')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const toggleStatus = async (id: any) => {
    try {
      await axios.patch(`${apiUrl}/templates/${id}/status`)
      message.success('Status berhasil diubah')
      fetchTemplates()
    } catch (error) {
      message.error('Gagal mengubah status')
    }
  }

  const deleteTemplate = async (id: any) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Template akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/templates/${id}`)
          message.success('Template berhasil dihapus')
          fetchTemplates()
        } catch (error) {
          message.error('Gagal menghapus template')
        }
      }
    })
  }

  const openModal = (template: any) => {
    setIsEdit(!!template)
    setCurrentId(template ? template._id : null)
    setHeader(template ? template.textHeader : '')
    setContent(template ? template.content : '')
    setCategory(template ? template.category : '')
    setReminderTime(template && template.reminderTime ? template.reminderTime : null)
    setSubCategory(template && template.subCategory ? template.subCategory : null)
    setIsOperationalHours(
      template && template.isOperationalHours ? template.isOperationalHours : false
    )
    setWithImage(template ? template.withImage : false)
    setPreviewImage(template ? template.imageUrl : null)
    form.setFieldsValue({
      templateName: template ? template.templateName : '',
      textHeader: template ? template.textHeader : '',
      content: template ? template.content : '',
      category: template ? template.category : '',
      reminderTime: template ? template.reminderTime : null,
      subCategory: template ? template.subCategory : null,
      isOperationalHours: template ? template.isOperationalHours : false,
      withImage: template ? template.withImage : false,
    })
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      let imageUrl = previewImage
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        const uploadRes = await axios.post(`${apiUrl}/uploads`, formData)
        imageUrl = uploadRes.data.imageUrl
      }

      const requestData = {
        ...values,
        imageUrl,
      }
      // console.log(requestData);
      
      if (isEdit) {
        await axios.put(`${apiUrl}/templates/${currentId}`, requestData)
        message.success('Template berhasil diperbarui')
      } else {
        await axios.post(`${apiUrl}/templates`, requestData)
        message.success('Template berhasil ditambahkan')
      }
      setIsModalOpen(false)
      form.resetFields()
      setImageFile(null)
      setPreviewImage(null)
      fetchTemplates()
    } catch (error) {
      message.error('Gagal menyimpan template')
    }
  }

  const columns = [
    {title: 'Name', dataIndex: 'templateName', key: 'name'},
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Sub Category',
      dataIndex: 'subCategory',
      key: 'subCategory',
      render: (text: any, record: any) => (record.category === 'Status' ? text || '-' : '-'),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text: any) => (text.length > 30 ? text.substring(0, 30) + '...' : text),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any, record: any) => (
        <Tag
          color={status === 'Active' ? 'green' : 'blue'}
          style={{cursor: 'pointer'}}
          onClick={() => toggleStatus(record._id)}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Reminder Time',
      dataIndex: 'reminderTime',
      key: 'reminderTime',
      render: (time: any, record: any) =>
        record.category === 'Reminder' ? `${time} Month(s)` : '-',
    },
    {
      title: 'Jam Operasional',
      dataIndex: 'isOperationalHours',
      key: 'isOperationalHours',
      render: (isOperationalHours: any, record: any) =>
        record.category === 'Auto Responder' ? (isOperationalHours ? '✅ Ya' : '❌ Tidak') : '-',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'image',
      render: (imageUrl: any) =>
        imageUrl ? <img src={imageUrl} alt="Template" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }} /> : '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <div style={{display: 'flex', gap: '10px'}}>
          <EditOutlined
            style={{color: '#1890ff', cursor: 'pointer'}}
            onClick={() => openModal(record)}
          />
          <DeleteOutlined
            style={{color: 'red', cursor: 'pointer'}}
            onClick={() => deleteTemplate(record._id)}
          />
        </div>
      ),
    },
  ]

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Hanya file gambar yang diperbolehkan!')
      return Upload.LIST_IGNORE // Mencegah file masuk ke daftar upload
    }
    return true
  }
  const handleImageChange = (info: any) => {


    if (info.file) {
      const file = info.file.originFileObj || info.file

      setImageFile(file)
      const reader = new FileReader()

      reader.onload = (e) => {
        console.log('File preview URL:', e.target?.result)
        setPreviewImage(e.target?.result as string)
      }

      reader.readAsDataURL(file)
    }
  }
  return (
    <div style={{padding: 20, background: '#fff', borderRadius: 8}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Search placeholder='Search template' style={{width: 250}} />
        <Button type='primary' icon={<PlusOutlined />} onClick={() => openModal(null)}>
          New Template
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={templates}
        loading={loading}
        rowKey='_id'
        pagination={{pageSize: 5}}
      />
      <Modal
        title={isEdit ? 'Edit Template' : 'Create New Template'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText='Save Template'
        cancelText='Cancel'
        width={800}
      >
        <div style={{display: 'flex', gap: 20}}>
          <div style={{flex: 1}}>
            <Form form={form} layout='vertical'>
              <Form.Item label='Template Name' name='templateName' rules={[{required: true}]}>
                <Input />
              </Form.Item>
              <Form.Item label='Category' name='category' rules={[{required: true}]}>
                <Select onChange={setCategory}>
                  <Option value='Text'>Text</Option>
                  <Option value='Status'>Status</Option>
                  <Option value='Reminder'>Reminder</Option>
                  <Option value='Auto Responder'>Auto Responder</Option>
                  <Option value='CSI'>CSI</Option>
                  <Option value='Quotation'>Quotation</Option>
                </Select>
              </Form.Item>
              <Form.Item name='withImage' valuePropName='checked'>
                <Checkbox onChange={(e) => setWithImage(e.target.checked)}>With Image</Checkbox>
              </Form.Item>
              {category === 'Text' && (
                <Form.Item label='Text Header' name='textHeader'>
                  <Input
                    maxLength={60}
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                  />
                </Form.Item>
              )}
              <Form.Item label='Content' name='content' rules={[{required: true}]}>
                <TextArea
                  rows={4}
                  maxLength={1024}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Item>

              {category === 'Reminder' && (
                <Form.Item
                  label='Reminder Time (Months)'
                  name='reminderTime'
                  rules={[{required: true}]}
                >
                  <Select onChange={setReminderTime}>
                    {[...Array(12)].map((_, i) => (
                      <Option key={i + 1} value={i + 1}>
                        {i + 1} Month(s)
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {category === 'Status' && (
                <Form.Item label='Sub Category' name='subCategory' rules={[{required: true}]}>
                  <Select onChange={setSubCategory} value={subCategory}>
                    {subCategoryOptions.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {category === 'Auto Responder' && (
                <Form.Item name='isOperationalHours' valuePropName='checked'>
                  <Checkbox onChange={(e) => setIsOperationalHours(e.target.checked)}>
                    Hanya kirim saat jam operasional
                  </Checkbox>
                </Form.Item>
              )}
              {/* Checkbox With Image */}

              {withImage && (
                <Form.Item label='Upload Image'>
                  <Upload
                    maxCount={1} // Hanya satu file
                    beforeUpload={beforeUpload}
                    onChange={handleImageChange}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                  
                </Form.Item>
              )}
            </Form>
          </div>
          <div
            style={{
              flex: 1,
              padding: 20,
              background: '#f5f5f5',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div style={{background: '#25d366', padding: 10, borderRadius: 8, color: 'white'}}>
              <strong>Your Customer</strong> ✅
            </div>
            <div
              style={{
                marginTop: 10,
                background: '#dcf8c6',
                padding: 10,
                borderRadius: 8,
                textAlign: 'left',
              }}
            >{previewImage && (
              <div style={{marginTop: 10, textAlign: 'center'}}>
                <img
                  src={previewImage}
                  alt='Preview'
                  style={{width: '100%', maxHeight: 200, borderRadius: 8}}
                />
              </div>
            )}
              {category === 'Text' && <strong>{header || 'Pengumuman'}</strong>}
              <p>{content || 'Terjadi perbaikan sistem malam ini...'}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export {TemplateChat}
