import React, {FC} from 'react'
import {useState} from 'react'

import './NewTukang.css'

import {Form, Row, Col, Button} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch, faPlus, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const NewTukang: FC = () => {
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
    <section id='new-tukang'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='col-8 d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                      <Form.Label>Tukang ID</Form.Label>
                      <Form.Control type='number' />
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
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Keahlian</Form.Label>

                    <a className='form-button-request'>
                      <Form.Label>Tambah Keahlian & jasa</Form.Label>
                      <i className="bi bi-plus"></i>
                    </a>
                  </div>
                      <Form.Control type='text' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type='password' />
                </Form.Group>

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
              <div className='form-header'></div>

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
                    <span className='upload-content'>{fileNameDiri}</span>
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
    </section>
  )
}

export {NewTukang}
