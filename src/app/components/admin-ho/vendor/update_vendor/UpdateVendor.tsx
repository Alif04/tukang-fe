import React, {FC, useState, useEffect, useRef} from 'react'
import {Vendor} from '../../../../interfaces/vendor'

import './UpdateVendor.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Row, Col, Button, ListGroup, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUpload, faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

interface StoreSelect {
  value: number
  label: string
}

interface ServiceArea {
  value: BigInteger
  label: string
}

interface ServiceAreaValues {
  value: BigInteger
  label: string
}

interface ServiceType {
  value: BigInteger
  label: string
}

interface ServiceTypeValues {
  value: BigInteger
  label: string
}

interface Bank {
  value: any
  label: string
}

interface CheckStates {
  compro: boolean
  suratPermohonan: boolean
  pks: boolean
  suip: boolean
  ptkp: boolean
}

const UpdateVendorHO: FC<{updatePageTitle: (vendor: Vendor) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch API
  const fetchVendorData = async () => {
    try {
      await axios
        .get(`${apiUrl}/vendor/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          updatePageTitle(data)

          if (data?.id) {
            setVendorId(data.id)
            setJoinDate(new Date(data.join_date).toISOString().split('T')[0])
            setPicName(data.pic_name)
            setVendorName(data.company_name)
            setVendorAddress(data.address)
            setEmailVendor(data.email_address)
            setPhoneNumberVendor(data.phone_number)
            setKtpNumber(data.ktp_number)
            setNpwpNumber(data.npwp_number)
            setMaxOrder(data.max_order)
          }

          if (data?.users) {
            setUsername(data.users.username)
          }

          if (data?.vendor_bank) {
            setBankIds(data.vendor_bank[0].id)
            setBankId(data.vendor_bank[0].bank_id)
            setBankName(data.vendor_bank[0].bank.bank_name)
            setAccountName(data.vendor_bank[0].account_name)
            setAccountNumber(data.vendor_bank[0].account_number)
          }

          if (data?.vendor_area) {
            setMarkup(data?.vendor_area[0]?.default_markup)
            setDiscount(data?.vendor_area[0]?.default_discount)
          }

          if (data?.vendor_store) {
            const store = data.vendor_store.map((item: any) => ({
              value: item.store.id,
              label: item.store.store_name,
            }))

            const storeId = data.vendor_store.map((item: any) => item.store.id)

            setStoreId(storeId)
            setStoreValues(store)
          }

          if (data?.vendor_store) {
            const vendorArea = data.vendor_store.map((item: any) => ({
              value: item?.store?.area?.id,
              label: item?.store?.area?.area,
            }))

            const vendorAreaId = data.vendor_area.map((item: any) => item?.store?.area?.id)

            setserviceAreaId(vendorAreaId)
            setServiceAreaValues(vendorArea)
          }

          if (data?.vendor_service) {
            const service_type = data.vendor_service.map((item: any) => ({
              value: item?.service_type_id,
              label: item?.service_type?.service_type,
            }))

            const vendorServiceId = data.vendor_service.map((item: any) => item.service_type_id)

            setserviceTypeId(vendorServiceId)
            setServiceTypeValues(service_type)
          }

          if (data?.vendor_document) {
            const documentTypes = [
              'npwp_file',
              'ktp_file',
              'compro_file',
              'surat_permohonan_file',
              'pks_file',
              'suip_file',
            ]

            type DocumentStateSetter = (state: {blob: string; fileName: string}) => void

            const documentStateSetters: Record<string, DocumentStateSetter> = {
              npwp_file: setimageNPWP,
              ktp_file: setimageKTP,
              compro_file: setimageCompro,
              surat_permohonan_file: setimageSuratPermohonan,
              pks_file: setimagePksEvidence,
              suip_file: setimageSuipEvidence,
            }

            data.vendor_document.forEach((document: any) => {
              const {document_name, path} = document

              if (documentTypes.includes(document_name)) {
                const setter = documentStateSetters[document_name]

                if (setter) {
                  setter({
                    blob: '',
                    fileName: path,
                  })
                }
              }
            })
          }

          if (data?.vendor_document) {
            const filteredData = data.vendor_document.filter(
              (item: any) => item.document_name === 'vendor_document'
            )

            const VendorDocumentValues = filteredData.map((item: any) => ({
              id: item.id,
              name: item.path,
            }))

            setUploadFiles(VendorDocumentValues)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.store_name,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getArea = async () => {
    try {
      const response = await axios.get(`${apiUrl}/area`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempArea = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.area,
        }))

        setServiceArea(tempArea)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getServiceType = async () => {
    try {
      const response = await axios.get(`${apiUrl}/service-type`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempServiceType = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.service_type,
        }))

        setServiceType(tempServiceType)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getBank = async () => {
    try {
      const response = await axios.get(`${apiUrl}/bank`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempBank = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.bank_name,
        }))

        setBank(tempBank)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchVendorData()
    getStore()
    getArea()
    getServiceType()
    getBank()
    // eslint-disable-next-line
  }, [])

  // Vendor Information
  const [vendorId, setVendorId] = useState<string>('')
  const [vendorName, setVendorName] = useState<string>('')
  const [joinDate, setJoinDate] = useState<string>('')
  const [picName, setPicName] = useState<string>('')
  const [emailVendor, setEmailVendor] = useState<string>('')
  const [phoneNumberVendor, setPhoneNumberVendor] = useState<any>()
  const [vendorAddress, setVendorAddress] = useState<any>('')
  const [username, setUsername] = useState<any>('')
  const [password, setPassword] = useState<any>('')
  const [maxOrder, setMaxOrder] = useState<string>('')

  const [ktpNumber, setKtpNumber] = useState<any>('')
  const [npwpNumber, setNpwpNumber] = useState<any>('')

  const [serviceAreaId, setserviceAreaId] = useState<any>([])

  const [storeId, setStoreId] = useState<any>([])
  const [store, setStore] = useState<StoreSelect[]>([])
  const [storeValues, setStoreValues] = useState<StoreSelect[]>([])

  const [serviceArea, setServiceArea] = useState<ServiceArea[]>([])
  const [serviceAreaValues, setServiceAreaValues] = useState<ServiceAreaValues[]>([])

  const [serviceTypeId, setserviceTypeId] = useState<any>([])
  const [serviceType, setServiceType] = useState<ServiceType[]>([])
  const [serviceTypeValues, setServiceTypeValues] = useState<ServiceTypeValues[]>([])

  // File Upload
  const [ktpEvidence, setKtpEvidence] = useState<FileList | []>()
  const [npwpEvidence, setNpwpEvidence] = useState<FileList | []>()
  const [comproEvidence, setComproEvidence] = useState<FileList | []>()
  const [suratPermohonanEvidence, setSuratPermohonanEvidence] = useState<FileList | []>()
  const [pksEvidence, setPksEvidence] = useState<FileList | []>()
  const [suipEvidence, setSuipEvidence] = useState<FileList | []>()
  const [ptkpEvidence, setPtkpEvidence] = useState<FileList | []>()

  const [uploadFiles, setUploadFiles] = useState<Array<File | null>>([])
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [imageKTP, setimageKTP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageNPWP, setimageNPWP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageCompro, setimageCompro] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageSuratPermohonan, setimageSuratPermohonan] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imagePksEvidence, setimagePksEvidence] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageSuipEvidence, setimageSuipEvidence] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imagePtkpEvidence, setimagePtkpEvidence] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  // Bank Information
  const [bank, setBank] = useState<Bank[]>([])
  const [bankIds, setBankIds] = useState<any>()
  const [bankId, setBankId] = useState<any>()
  const [bankName, setBankName] = useState<string>('')
  const [accountNumber, setAccountNumber] = useState<any>()
  const [accountName, setAccountName] = useState<string>('')
  const [markup, setMarkup] = useState<any>()
  const [discount, setDiscount] = useState<any>()

  // Handle Join Date Change
  const today = new Date().toISOString().split('T')[0]

  const handleChangeJoinDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedJoinDate = event.target.value
    setJoinDate(updatedJoinDate)
  }

  // Handle Change Input Vendor
  const handleChangeVendorName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVendorName = event.target.value
    setVendorName(updatedVendorName)
  }

  const handleChangeVendorPicName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVendorPicName = event.target.value
    setPicName(updatedVendorPicName)
  }

  const handleChangeVendorEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVendorEmail = event.target.value
    setEmailVendor(updatedVendorEmail)
  }

  const handleChangeVendorPhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVendorPhoneNumber = event.target.value
    setPhoneNumberVendor(updatedVendorPhoneNumber)
  }

  const handleChangeVendorAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVendorAddress = event.target.value
    setVendorAddress(updatedVendorAddress)
  }

  const handleChangeUsernameVendor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedUsernameVendor = event.target.value
    setUsername(updatedUsernameVendor)
  }

  const handleChangePasswordVendor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPasswordVendor = event.target.value
    setPassword(updatedPasswordVendor)
  }

  const handleChangeMaxOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedMaxOrder = event.target.value
    setMaxOrder(updatedMaxOrder)
  }

  const [isActive, setisActive] = useState<CheckStates>({
    compro: true,
    suratPermohonan: true,
    pks: true,
    suip: true,
    ptkp: true,
  })

  useEffect(() => {
    if (imageCompro.fileName !== '') {
      setisActive((prevState) => ({
        ...prevState,
        compro: true,
      }))
    } else {
      setisActive((prevState) => ({
        ...prevState,
        compro: false,
      }))
    }

    if (imageSuratPermohonan.fileName !== '') {
      setisActive((prevState) => ({
        ...prevState,
        suratPermohonan: true,
      }))
    } else {
      setisActive((prevState) => ({
        ...prevState,
        suratPermohonan: false,
      }))
    }

    if (imagePksEvidence.fileName !== '') {
      setisActive((prevState) => ({
        ...prevState,
        pks: true,
      }))
    } else {
      setisActive((prevState) => ({
        ...prevState,
        pks: false,
      }))
    }

    if (imageSuipEvidence.fileName !== '') {
      setisActive((prevState) => ({
        ...prevState,
        suip: true,
      }))
    } else {
      setisActive((prevState) => ({
        ...prevState,
        suip: false,
      }))
    }

    if (imagePtkpEvidence.fileName !== '') {
      setisActive((prevState) => ({
        ...prevState,
        ptkp: true,
      }))
    } else {
      setisActive((prevState) => ({
        ...prevState,
        ptkp: false,
      }))
    }
  }, [
    imageCompro.fileName,
    imageSuratPermohonan.fileName,
    imagePksEvidence.fileName,
    imageSuipEvidence.fileName,
    imagePtkpEvidence.fileName,
  ])

  // console.log('isActive Compro', isActive.compro)
  // console.log('isActive Surat Permohonan', isActive.suratPermohonan)

  const handleFormCheckbox = (element: keyof CheckStates) => {
    setisActive({...isActive, [element]: !isActive[element]})
  }

  // Handle Upload KTP
  const handleFileChangeKTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setKtpEvidence(files)

      setimageKTP({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadKTP = () => {
    const inputField = document.getElementById('input-ktp-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Upload NPWP
  const handleFileChangeNPWP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setNpwpEvidence(files)

      setimageNPWP({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadNPWP = () => {
    const inputField = document.getElementById('input-npwp-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Upload Compro
  const handleFileChangeCompro = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setComproEvidence(files)

      setimageCompro({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadCompro = () => {
    const inputField = document.getElementById('input-compro-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Upload Surat Permohonan
  const handleFileChangeSuratPermohonan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setSuratPermohonanEvidence(files)

      setimageSuratPermohonan({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadSuratPermohonan = () => {
    const inputField = document.getElementById('input-surat_permohonan-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Upload PKS Evidence
  const handleFileChangePksEvidence = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setPksEvidence(files)

      setimagePksEvidence({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadPksEvidence = () => {
    const inputField = document.getElementById('input-pks-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Upload SUIP Evidence
  const handleFileChangeSuipEvidence = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setSuipEvidence(files)

      setimageSuipEvidence({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadSuipEvidence = () => {
    const inputField = document.getElementById('input-suip-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Upload PTKP Evidence
  const handleFileChangePtkpEvidence = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setPtkpEvidence(files)

      setimagePtkpEvidence({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadPtkpEvidence = () => {
    const inputField = document.getElementById('input-ptkp-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()

      const existingFiles = [...uploadFiles]

      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setUploadFiles(mergedFiles)
    }
  }

  const handleImageClick = () => {
    const inputField = document.getElementById('file-input') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...uploadFiles]

    newEvidances.splice(index, 1)

    setUploadFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Handle Change Input KTP Number
  const handleChangeKTPNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedKTPNumber = event.target.value
    setKtpNumber(updatedKTPNumber)
  }

  // Handle Change Input NPWP Number
  const handleChangeNPWPNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNPWPNumber = event.target.value
    setNpwpNumber(updatedNPWPNumber)
  }

  // Handle Change Input Bank
  const handleChangeSelectBank = (element: Bank | null) => {
    const newBankInfo: Bank = {
      value: element?.value || 0,
      label: element?.label || '',
    }

    setBankId(newBankInfo.value)
    setBankName(newBankInfo.label)
  }

  const handleChangeAccountName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAccountName = event.target.value
    setAccountName(updatedAccountName)
  }

  const handleChangeAccountNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAccountNumber = event.target.value
    setAccountNumber(updatedAccountNumber)
  }

  const handleChangeMarkup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedMarkup = event.target.value
    setMarkup(updatedMarkup)
  }

  // const handleChangeDiscount = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedDiscount = event.target.value
  //   setDiscount(updatedDiscount)
  // }

  // Change Select Store Area
  const handleChangeStoreId = (element: any) => {
    const updatedStore = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    const updatedStoreIds = updatedStore.map((option: any) => option.value)

    setStoreId(updatedStoreIds)
    setStoreValues(updatedStore)
  }

  // Change Select Service Area
  const handleChangeServiceArea = (element: any) => {
    const updatedServiceArea = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    const updatedServiceAreaIds = updatedServiceArea.map((option: any) => option.value)

    setserviceAreaId(updatedServiceAreaIds)
    setServiceAreaValues(updatedServiceArea)
  }

  // Change Select Service Type
  const handleChangeServiceType = (element: any) => {
    const updatedServiceType = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    const updatedServiceTypeIds = updatedServiceType.map((option: any) => option.value)

    setserviceTypeId(updatedServiceTypeIds)
    setServiceTypeValues(updatedServiceType)
  }

  // Vendor Validation
  const VendorValidation = () => {
    let valid = true

    if (!joinDate) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Join Date form',
        icon: 'warning',
      })
      valid = false
    } else if (!vendorName) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Nama Perusahaan form',
        icon: 'warning',
      })
      valid = false
    } else if (!emailVendor) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Email form',
        icon: 'warning',
      })
      valid = false
    } else if (!phoneNumberVendor) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Nomor HP / WA form',
        icon: 'warning',
      })
      valid = false
    } else if (!serviceAreaId) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select Service Area form',
        icon: 'warning',
      })
      valid = false
    } else if (!serviceTypeId) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select Service Type form',
        icon: 'warning',
      })
      valid = false
    } else if (!vendorAddress) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Vendor Address form',
        icon: 'warning',
      })
      valid = false
    } else if (!bankName) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Nama Bank form',
        icon: 'warning',
      })
      valid = false
    } else if (!accountNumber) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Nomor Account form',
        icon: 'warning',
      })
      valid = false
    } else if (!accountName) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Account Name form',
        icon: 'warning',
      })
      valid = false
    } else if (maxOrder === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Max Order form',
        icon: 'warning',
      })
      valid = false
    } else if (maxOrder < '3') {
      Swal.fire({
        title: 'Warning',
        text: 'Each Vendor have 3 minimal order',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Handle Submit Update Vendor
  const handleUpdateVendor = async () => {
    if (VendorValidation()) {
      setIsLoading(true)

      const formData = new FormData()

      formData.append('id', vendorId)
      formData.append('pic_name', picName)
      formData.append('company_name', vendorName)
      formData.append('address', vendorAddress)
      formData.append('phone_number', phoneNumberVendor)
      formData.append('email_address', emailVendor)
      formData.append('join_date', joinDate)
      formData.append('max_order', maxOrder)

      formData.append('vendor_bank[id]', bankIds)
      formData.append('vendor_bank[bank_id]', bankId)
      formData.append('vendor_bank[account_number]', accountNumber)
      formData.append('vendor_bank[account_name]', accountName)

      if (username) {
        formData.append('username', username)
      }

      if (ktpNumber) {
        formData.append('ktp_number', ktpNumber)
      }

      if (npwpNumber) {
        formData.append('npwp_number', npwpNumber)
      }

      if (password) {
        formData.append('password', password)
      }

      if (npwpEvidence?.length) {
        formData.append('npwp_file', npwpEvidence[0])
      }

      if (ktpEvidence?.length) {
        formData.append('ktp_file', ktpEvidence[0])
      }

      if (isActive && comproEvidence?.length) {
        formData.append('compro_file', comproEvidence[0])
      }

      if (isActive && suratPermohonanEvidence?.length) {
        formData.append('surat_permohonan_file', suratPermohonanEvidence[0])
      }

      if (isActive && pksEvidence?.length) {
        formData.append('pks_file', pksEvidence[0])
      }

      if (isActive && suipEvidence?.length) {
        formData.append('suip_file', suipEvidence[0])
      }

      if (isActive && ptkpEvidence?.length) {
        formData.append('ptkp_file', ptkpEvidence[0])
      }

      if (uploadFiles?.length) {
        uploadFiles.forEach((item) => {
          if (item instanceof Blob) {
            formData.append(`vendor_document`, item, item.name)
          }
        })
      }

      if (serviceAreaId?.length) {
        serviceAreaId.forEach((item: any, index: number) => {
          if (item) {
            formData.append(`vendor_area[${index}][city_id]`, item)
            formData.append(`vendor_area[${index}][default_markup]`, markup)
            formData.append(`vendor_area[${index}][default_discount]`, discount)
          }
        })
      }

      if (serviceTypeId?.length) {
        serviceTypeId.forEach((item: any, index: number) => {
          if (item) {
            formData.append(`vendor_service[${index}][service_type_id]`, item)
          }
        })
      }

      if (storeId?.length) {
        storeId.forEach((item: any, index: number) => {
          if (item) {
            formData.append(`vendor_store[${index}][store_id]`, item)
          }
        })
      }

      await axios
        .post(`${apiUrl}/vendor/${params.id}`, formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          if (response.data.status === 200 || response.data.status === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Success Update Vendor',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            })

            setIsLoading(false)
          } else {
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })

            setIsLoading(false)
          }

          navigate('/vendor/view-vendor')
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)

          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })
        })
    }
  }

  return (
    <section id='update-vendor'>
      <Card className='mb-5'>
        <Card.Header>
          <Card.Title>Informasi Vendor</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col xxl={6} xl={6} lg={12} md={12}>
              <Row className='header-body'>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm='4'>
                      Vendor ID
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control readOnly value={vendorId} />
                    </Col>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm='4'>
                      Join Date
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control
                        type='date'
                        onChange={handleChangeJoinDate}
                        min={today}
                        value={joinDate}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Nama Perusahaan</Form.Label>

                  <Form.Control type='text' onChange={handleChangeVendorName} value={vendorName} />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Col>
                  <Form.Group>
                    <Form.Label>Nama PIC</Form.Label>

                    <Form.Control
                      type='text'
                      value={picName}
                      onChange={handleChangeVendorPicName}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Nomor HP / WA</Form.Label>

                    <Form.Control
                      type='text'
                      onChange={handleChangeVendorPhoneNumber}
                      value={phoneNumberVendor}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type='email'
                    onChange={handleChangeVendorEmail}
                    value={emailVendor}
                  />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Col>
                  <Form.Group>
                    <Form.Label>Service Area</Form.Label>

                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Service Area'
                      isSearchable={true}
                      isMulti
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={serviceArea}
                      onChange={(element) => handleChangeServiceArea(element)}
                      value={serviceAreaValues}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Service Type</Form.Label>

                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Service Type'
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={serviceType}
                      onChange={(element) => handleChangeServiceType(element)}
                      value={serviceTypeValues}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='form-body'>
                <Col>
                  <Form.Group>
                    <Form.Label>Assign To Store</Form.Label>

                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      isMulti
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={store}
                      value={storeValues}
                      onChange={(element) => handleChangeStoreId(element)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as='textarea'
                    className='address-form'
                    onChange={handleChangeVendorAddress}
                    value={vendorAddress}
                  />
                </Form.Group>
              </Row>
            </Col>

            <Col xxl={3} xl={3} lg={12} md={12}>
              <Row className='header-body'></Row>

              <Row className='form-body'>
                <Form.Group>
                  <div className='d-flex justify-content-between' onClick={handleUploadKTP}>
                    <Form.Control
                      id='input-ktp-file'
                      type='file'
                      // accept='image/*'
                      accept='.jpg, .jpeg, .png'
                      hidden
                      className='input-field-image'
                      onChange={handleFileChangeKTP}
                    />

                    <Form.Label className='me-2'>KTP</Form.Label>

                    <div className='d-flex'>
                      <Form.Label className='me-2 text-decoration-underline text-primary'>
                        {imageKTP.fileName ? imageKTP.fileName : ''}
                      </Form.Label>

                      <FontAwesomeIcon icon={faUpload} size='lg' />
                    </div>
                  </div>

                  <Form.Control type='number' onChange={handleChangeKTPNumber} value={ktpNumber} />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <div className='d-flex justify-content-between' onClick={handleUploadNPWP}>
                    <Form.Control
                      id='input-npwp-file'
                      type='file'
                      // accept='image/*'
                      accept='.jpg, .jpeg, .png'
                      hidden
                      className='input-field-image'
                      onChange={handleFileChangeNPWP}
                    />

                    <Form.Label className='me-2'>NPWP</Form.Label>

                    <div className='d-flex'>
                      <Form.Label className='me-2 text-decoration-underline text-primary'>
                        {imageNPWP.fileName ? imageNPWP.fileName : ''}
                      </Form.Label>

                      <FontAwesomeIcon icon={faUpload} size='lg' />
                    </div>
                  </div>

                  <Form.Control
                    type='texnumber'
                    onChange={handleChangeNPWPNumber}
                    value={npwpNumber}
                  />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group className='d-flex justify-content-between align-items-center mb-2'>
                  <Form.Control
                    id='input-compro-file'
                    type='file'
                    // accept='image/*'
                    accept='.jpg, .jpeg, .png'
                    hidden
                    className='input-field-image'
                    onChange={handleFileChangeCompro}
                  />

                  <div className='upload d-flex align-items-center'>
                    <Form.Check
                      checked={isActive.compro}
                      onChange={() => handleFormCheckbox('compro')}
                    />

                    <Form.Label className='ms-2'>COMPRO</Form.Label>
                  </div>

                  <Form.Label className='text-primary fw-semibold text-decoration-underline ms-2 me-2'>
                    {imageCompro.fileName ? imageCompro.fileName : ''}
                  </Form.Label>

                  <FontAwesomeIcon icon={faUpload} size='lg' onClick={handleUploadCompro} />
                </Form.Group>

                <Form.Group className='d-flex justify-content-between align-items-center mb-2'>
                  <Form.Control
                    id='input-surat_permohonan-file'
                    type='file'
                    // accept='image/*'
                    accept='.jpg, .jpeg, .png'
                    hidden
                    className='input-field-image'
                    onChange={handleFileChangeSuratPermohonan}
                  />

                  <div className='upload d-flex align-items-center'>
                    <Form.Check
                      checked={isActive.suratPermohonan}
                      onChange={() => handleFormCheckbox('suratPermohonan')}
                    />

                    <Form.Label className='ms-2'>Surat Pemohonan</Form.Label>
                  </div>

                  <Form.Label className='text-primary fw-semibold text-decoration-underline ms-2 me-2'>
                    {imageSuratPermohonan.fileName ? imageSuratPermohonan.fileName : ''}
                  </Form.Label>

                  <FontAwesomeIcon
                    icon={faUpload}
                    size='lg'
                    onClick={handleUploadSuratPermohonan}
                  />
                </Form.Group>

                <Form.Group className='d-flex justify-content-between align-items-center mb-2'>
                  <Form.Control
                    id='input-pks-file'
                    type='file'
                    // accept='image/*'
                    accept='.jpg, .jpeg, .png'
                    hidden
                    className='input-field-image'
                    onChange={handleFileChangePksEvidence}
                  />

                  <div className='upload d-flex align-items-center'>
                    <Form.Check checked={isActive.pks} onChange={() => handleFormCheckbox('pks')} />
                    <Form.Label className='ms-2'>PKS</Form.Label>
                  </div>

                  <Form.Label className='text-primary fw-semibold text-decoration-underline ms-2 me-2'>
                    {imagePksEvidence.fileName ? imagePksEvidence.fileName : ''}
                  </Form.Label>

                  <FontAwesomeIcon icon={faUpload} size='lg' onClick={handleUploadPksEvidence} />
                </Form.Group>

                <Form.Group className='d-flex justify-content-between align-items-center mb-2'>
                  <Form.Control
                    id='input-suip-file'
                    type='file'
                    // accept='image/*'
                    accept='.jpg, .jpeg, .png'
                    hidden
                    className='input-field-image'
                    onChange={handleFileChangeSuipEvidence}
                  />

                  <div className='upload d-flex align-items-center'>
                    <Form.Check
                      checked={isActive.suip}
                      onChange={() => handleFormCheckbox('suip')}
                    />
                    <Form.Label className='ms-2'>SIUP</Form.Label>
                  </div>

                  <Form.Label className='text-primary fw-semibold text-decoration-underline ms-2 me-2'>
                    {imageSuipEvidence.fileName ? imageSuipEvidence.fileName : ''}
                  </Form.Label>

                  <FontAwesomeIcon icon={faUpload} size='lg' onClick={handleUploadSuipEvidence} />
                </Form.Group>

                <Form.Group className='d-flex justify-content-between align-items-center mb-2'>
                  <Form.Control
                    id='input-ptkp-file'
                    type='file'
                    // accept='image/*'
                    accept='.jpg, .jpeg, .png'
                    hidden
                    className='input-field-image'
                    onChange={handleFileChangePtkpEvidence}
                  />

                  <div className='upload d-flex align-items-center'>
                    <Form.Check
                      checked={isActive.ptkp}
                      onChange={() => handleFormCheckbox('ptkp')}
                    />
                    <Form.Label className='ms-2'>PTKP</Form.Label>
                  </div>

                  <Form.Label className='text-primary fw-semibold text-decoration-underline ms-2 me-2'>
                    {imagePtkpEvidence.blob ? imagePtkpEvidence.fileName : ''}
                  </Form.Label>

                  <FontAwesomeIcon icon={faUpload} size='lg' onClick={handleUploadPtkpEvidence} />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Upload other docs</Form.Label>
                  <Form className='form-input-image' onClick={handleImageClick}>
                    <Form.Control
                      id='file-input'
                      type='file'
                      // accept='image/*'
                      accept='.jpg, .jpeg, .png'
                      multiple
                      hidden
                      ref={evidenceRef}
                      onChange={handleFileChange}
                    />

                    <div className='input-image-text'>
                      <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                      <p>Add File</p>
                    </div>
                  </Form>

                  <ListGroup className='pt-3'>
                    {uploadFiles.length ? (
                      uploadFiles.map((item, index) => (
                        <ListGroup.Item
                          key={`${item?.name}-${index}-${item?.type}`}
                          className='d-flex justify-content-between'
                        >
                          <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                          <span className='upload-content'>{item?.name}</span>

                          <FontAwesomeIcon
                            icon={faTrash}
                            size='sm'
                            color='#ed2b2a'
                            style={{cursor: 'pointer'}}
                            onClick={(e) => handleRemoveFile(index)}
                          />
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className='d-flex justify-content-center'>
                        Tidak ada file yang dipilih
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Form.Group>
              </Row>
            </Col>

            <Col xxl={3} xl={3} lg={12} md={12}>
              <Row className='header-body'></Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Nama Bank</Form.Label>

                  <Select
                    classNamePrefix='select'
                    placeholder='Pilih Nama Bank'
                    isSearchable={true}
                    options={bank}
                    onChange={(element) => handleChangeSelectBank(element)}
                    value={{
                      value: bankId,
                      label: bankName,
                    }}
                  />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Nomor Account</Form.Label>

                  <Form.Control
                    type='number'
                    onChange={handleChangeAccountNumber}
                    value={accountNumber}
                  />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Nama Pemilik Account</Form.Label>

                  <Form.Control
                    type='text'
                    onChange={handleChangeAccountName}
                    value={accountName}
                  />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Margin</Form.Label>

                    <div className='form-check-request'>
                      <Form.Check inline label='Rp' name='group1' type='radio' />
                      <Form.Check inline label='%' checked name='group1' type='radio' />
                    </div>
                  </div>

                  <Form.Control type='number' onChange={handleChangeMarkup} value={markup} />
                </Form.Group>
              </Row>

              <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Maksimal Order</Form.Label>

                  <Form.Control
                    min={3}
                    type='number'
                    onChange={handleChangeMaxOrder}
                    value={maxOrder}
                  />
                </Form.Group>
              </Row>

              {/* <Row className='form-body'>
                <Form.Group>
                  <Form.Label>Discount</Form.Label>

                  <Form.Control type='number' onChange={handleChangeDiscount} value={discount} />
                </Form.Group>
              </Row> */}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <hr />

      <Card className='mb-5'>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col xxl={6}>
              <Form.Group className='tukang-info'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  name='username'
                  onChange={handleChangeUsernameVendor}
                  value={username}
                />

                <Form.Text className='fs-8 fs-l text-dark-danger'>
                  *Jika username kosong, maka sistem akan menghasilkan username secara otomatis dari
                  alamat email
                </Form.Text>
              </Form.Group>
            </Col>

            <Col xxl={6}>
              <Form.Group className='tukang-info'>
                <Form.Label>Reset Password</Form.Label>
                <Form.Control
                  type='text'
                  name='password'
                  onChange={handleChangePasswordVendor}
                  value={password}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className='d-flex justify-content-center mt-5'>
            <Button
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={handleUpdateVendor}
            >
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateVendorHO}
