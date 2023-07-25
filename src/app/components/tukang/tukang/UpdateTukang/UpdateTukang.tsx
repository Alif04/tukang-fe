import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateTukang.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, InputGroup, FormControl} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch, faPlus, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

interface DataType {
  key: string
  tukang_id: string
  tanggal_join: string
  nama_lengkap: string
  tanggal_lahir: string
  keahlian: string
  KTP: string
  nomor: string
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/order/detail-order')
  }

  return (
    <a className='button-detail' onClick={handleDetail}>
      <FontAwesomeIcon icon={faBook} size='sm' />
    </a>
  )
}

const EditButton = () => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate('/order/update-order')
  }

  return (
    <a className='button-edit' onClick={handleEdit}>
      <FontAwesomeIcon icon={faPen} size='sm' />
    </a>
  )
}

const DeleteButton = () => (
  <a className='button-delete'>
    <FontAwesomeIcon icon={faTrash} size='sm' />
  </a>
)

const columns: ColumnsType<DataType> = [
  {
    title: 'Tukang ID',
    dataIndex: 'tukang_id',
    key: 'tukang_id',
    align: 'center',
    width: 70,
    className: 'col_tukang_id',
  },
  {
    title: 'Tanggal Join',
    dataIndex: 'tanggal_join',
    key: 'tanggal_join',
    align: 'center',
    width: 80,
  },
  {
    title: 'Nama Lengkap',
    dataIndex: 'nama_lengkap',
    key: 'nama_lengkap',
    align: 'left',
    width: 120,
  },
  {
    title: 'Tanggal Lahir',
    dataIndex: 'tanggal_lahir',
    key: 'tanggal_lahir',
    align: 'left',
    width: 80,
  },
  {
    title: 'Keahlian',
    dataIndex: 'keahlian',
    key: 'keahlian',
    align: 'left',
    width: 120,
  },
  {
    title: 'KTP',
    dataIndex: 'KTP',
    key: 'KTP',
    align: 'center',
    width: 120,
  },
  {
    title: 'Nomor',
    dataIndex: 'nomor',
    key: 'nomor',
    align: 'left',
    width: 120,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='button-wrapper'>
        <DetailButton />
        <EditButton />
        <DeleteButton />
      </div>
    ),
    fixed: 'right',
    width: 115,
  },
]

const data: DataType[] = [
  {
    key: '1',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Water Heater',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986747',
    nomor: 'Alia',
  },
  {
    key: '2',
    tukang_id: '78453993',
    tanggal_join: '13/2/2023',
    nama_lengkap: 'AC',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986748',
    nomor: 'Abdulah',
  },
  {
    key: '3',
    tukang_id: '78453994',
    tanggal_join: '14/2/2023',
    nama_lengkap: 'Water Heater',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986710',
    nomor: 'Alice',
  },
  {
    key: '4',
    tukang_id: '78453994',
    tanggal_join: '14/2/2023',
    nama_lengkap: 'Water Heater',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986710',
    nomor: 'Alice',
  },
  {
    key: '5',
    tukang_id: '78453994',
    tanggal_join: '14/2/2023',
    nama_lengkap: 'Water Heater',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986710',
    nomor: 'Alice',
  },
  {
    key: '6',
    tukang_id: '78453994',
    tanggal_join: '14/2/2023',
    nama_lengkap: 'Water Heater',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986710',
    nomor: 'Alice',
  },
  {
    key: '7',
    tukang_id: '78453994',
    tanggal_join: '14/2/2023',
    nama_lengkap: 'Water Heater',
    tanggal_lahir: 'New set up',
    keahlian: 'PAID',
    KTP: '8986710',
    nomor: 'Alice',
  },
]

const UpdateTukang: FC = () => {
  const [fileName, setFileName] = useState<string>('No selected file')
  const [image, setImage] = useState<string | null>(null)
  const [fileNameDiri, setFileNameDiri] = useState<string>('No selected file')
  const [imageDiri, setImageDiri] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setFileName(files[0].name)
      setImage(URL.createObjectURL(files[0]))
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setFileName('No selected file')
    setImage(null)
  }

  const handleFileChangeDiri = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setFileNameDiri(files[0].name)
      setImageDiri(URL.createObjectURL(files[0]))
    }
  }

  const handleImageClickDiri = () => {
    const inputField = document.querySelector('.input-field-image2') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFileDiri = () => {
    setFileNameDiri('No selected file')
    setImageDiri(null)
  }

  return (
    <section id='update-order'>
       <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='col-8 d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-body'>
                <Form.Group className='mb-5'>
                      <Form.Label>Tukang ID</Form.Label>
                      <Form.Control type='text' className='filter-rtl'/>
                </Form.Group>

                <Form.Group className='mb-5'>
                      <Form.Label>Tanggal Lahir</Form.Label>
                      <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                      <Form.Label>WA/Phone Number</Form.Label>
                      <Form.Control type='number' />
                </Form.Group>

                <Form.Group className='mb-5'>
                    <Form.Label>Keahlian</Form.Label>
                    <Form.Control type='text' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>

              <div className='form-body'>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Tukang</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Umur</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nomor KTP</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Harga Jasa</Form.Label>
                  <Form.Control type='number' />
                </Form.Group>
              </div>
            </div>
                <div className='col-12'>
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </div>
            </div>

            <div className='costumer-information'>

              <div className='form-body'>
                <Form.Group controlId='formFile' className='mb-5'>
                  <Form.Label>Upload Photo Diri</Form.Label>
                  <Form className='form-input-image diri' onClick={handleImageClickDiri}>
                    <Form.Control
                      type='file'
                      accept='image/*'
                      className='input-field-image2'
                      hidden
                      onChange={handleFileChangeDiri}
                    />

                    {imageDiri ? (
                      <img src={imageDiri} alt={fileNameDiri} className='image-preview' />
                    ) : (
                      <i className="bi bi-upload"></i> 
                    )}
                  </Form>
                {imageDiri ? (
                  <div className='uploaded-row'>
                    <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />
                    <span className='upload-content'>{fileName}</span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size='sm'
                      color='#ed2b2a'
                      style={{cursor: 'pointer'}}
                      onClick={handleRemoveFileDiri}
                    />
                  </div>
                  ) : (
                    <div></div>
                  )}
                </Form.Group>

                <Form.Group controlId='formFile' className='mb-5'>
                  <Form.Label>Upload Dokumen dan foto lainnya</Form.Label>
                  <Form className='form-input-image' onClick={handleImageClick}>
                    <Form.Control
                      type='file'
                      accept='image/*'
                      className='input-field-image'
                      hidden
                      onChange={handleFileChange}
                    />

                    {image ? (
                      <img src={image} alt={fileName} className='image-preview' />
                    ) : (
                      <i className="bi bi-upload"></i> 
                    )}
                  </Form>
                  {image ? (
                  <div className='uploaded-row'>
                    <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />
                    <span className='upload-content'>{fileName}</span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size='sm'
                      color='#ed2b2a'
                      style={{cursor: 'pointer'}}
                      onClick={handleRemoveFile}
                    />
                  </div>
                  ) : (
                    <div></div>
                  )}
                </Form.Group>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit'>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit'>
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='table-head-wrapper'>
            <div className='middle'>
              <div className='filter-search'>
                <InputGroup>
                  <Form.Control placeholder='Search Work Order' className='filter-rtl' />

                  <InputGroup.Text className='filter-rtl'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>
            <div className='button-right'>
              <a className='form-button-request'>
                <Form.Label>New Tukang</Form.Label>
                <i className="bi bi-plus"></i>
              </a>
            </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 1500}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {UpdateTukang}
