import React, {FC, useState, useEffect} from 'react'
import {Orders} from '../../../../interfaces/order'

import './PrintoutCS.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Skeleton} from 'antd'
import {useNavigate, useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Row, Col, Card, Button} from 'react-bootstrap'

const PrintoutOrderCS: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [isPrinting, setIsPrinting] = useState<boolean>(false)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)

  const fetchOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setOrderDetail(data)
          updatePageTitle(data)
          setIsLoadingPage(false)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  useEffect(() => {
    if (isPrinting) {
      window.print()
      setIsPrinting(false)
    }
  }, [isPrinting])

  // Handle Print
  const handlePrintOrder = async () => {
    try {
      await axios
        .request({
          url: `${apiUrl}/orders/${params.id}/counter`,
          method: 'post',
          maxBodyLength: Infinity,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        // fetchOrderData()
        .then(() => {
          setIsPrinting(true)
        })
        .catch((error) => {
          console.error(error)

          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })
        })
    } catch (error) {
      console.error(error)
    }
  }

  // Handle Cancel Print
  const handleCancelPrint = () => {
    navigate(`/order/update-order/${params.id}`)
  }

  // Grand Total Order
  const calculateTotal = (orderDetail: any) => {
    const {payment_type, is_overdistance, grand_total, additional_fee} = orderDetail ?? {}

    let totalAmount = 0

    if (payment_type === 'gratis') {
      totalAmount = is_overdistance === 1 ? Number(grand_total) : 0
    } else if (payment_type === 'pemasangan_tanpa_survey') {
      totalAmount = is_overdistance === 1 ? Number(grand_total) : grand_total ?? 0
    } else if (payment_type === 'survey') {
      totalAmount =
        is_overdistance === 1 ? Number(grand_total) + Number(additional_fee) : 99000 ?? 0
    }

    return `Rp. ${Number(totalAmount).toLocaleString('id')}`
  }

  return (
    <section id='printout-cs'>
      <Card>
        <Card.Header>
          <Row className='content-header'>
            <Col md={6} sm={12}>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                <div className='header-logo'>
                  <img
                    alt='Logo Mitra10'
                    className='h-30px logo mb-3 pe-1'
                    src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                  />

                  <h1 className='ps-1 fs-3 fw-bold text-black'>Instalasi & Service Mitra 10</h1>
                </div>
              </Skeleton>
            </Col>

            <Col md={6} sm={12}>
              <div className='header-information'>
                <Skeleton active loading={isLoadingPage}>
                  <h1 className='fs-5 fw-bold mb-2 text-black'>
                    Tanggal Order :{' '}
                    <span className='fw-normal text-black'>
                      {new Date(orderDetail?.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </h1>

                  <h1 className='fs-5 fw-bold mb-2 text-black'>
                    {(() => {
                      if (orderDetail?.payment_type === 'survey') {
                        return `Request Survey`
                      } else if (orderDetail?.payment_type === 'gratis') {
                        return `Request Pemasangan`
                      } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                        return `Request Pemasangan`
                      } else {
                        return ``
                      }
                    })()}{' '}
                    :{' '}
                    <span className='fw-normal text-black'>
                      {new Date(orderDetail?.request_survey).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </h1>
                </Skeleton>
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Skeleton loading={isLoadingPage}>
            <div className='detail-pemesanan'>
              <h3 className='fs-3 fw-bold mb-3'>Detail Pemesanan</h3>

              <div className='detail-info'>
                <h1 className='fs-5 fw-normal mb-1 text-black'>
                  Order ID : <span className='fw-semibold text-black'>{orderDetail?.id}</span>
                </h1>

                <h1 className='fs-5 fw-normal mb-1 text-black'>
                  Nomor Receipt :{' '}
                  <span className='fw-semibold text-black'>{orderDetail?.receipt_number}</span>
                </h1>

                <h1 className='fs-5 fw-normal mb-2 text-black'>
                  Tipe Pembayaran :{' '}
                  <span className='fw-semibold text-black'>
                    {(() => {
                      if (orderDetail?.payment_type === 'survey') {
                        return `Berbayar & Survey`
                      } else if (orderDetail?.payment_type === 'gratis') {
                        return `Gratis`
                      } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                        return `Berbayar & Pemasangan Tanpa Survey`
                      } else {
                        return ``
                      }
                    })()}
                  </span>
                </h1>
              </div>
            </div>

            <Table hover responsive className='mt-5'>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Nama Jasa Pemasangan</th>
                  <th>QTY Pemasangan</th>
                  {!(
                    orderDetail?.payment_type === 'gratis' || orderDetail?.payment_type === 'survey'
                  ) && (
                    <>
                      <th>Harga Jasa</th>
                      <th>Jumlah</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {orderDetail?.order_details?.map((item: any, index: any) => (
                  <>
                    <tr key={`${index} - order_detail`}>
                      <td>{item?.item_code ?? '-'}</td>
                      <td>{item?.item_name ?? '-'}</td>
                      <td>
                        {orderDetail?.payment_type === 'survey'
                          ? item?.item_notes
                          : item?.item?.service_name}
                      </td>
                      <td>{item?.quantity ?? 0}</td>
                      {!(
                        orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'survey'
                      ) && (
                        <>
                          <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                          <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                        </>
                      )}
                    </tr>
                  </>
                ))}

                {orderDetail?.payment_type !== 'gratis' &&
                  orderDetail?.payment_type !== 'pemasangan_tanpa_survey' && (
                    <tr>
                      <td colSpan={3} className='text-end fw-bolder'>
                        Biaya Survey
                      </td>

                      <td className=' fw-bolder'>
                        {orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                          ? `Rp. ${(0).toLocaleString('id')}`
                          : orderDetail?.payment_type === 'survey'
                          ? `Rp. ${(99000).toLocaleString('id')}`
                          : `Rp. ${0}`}
                      </td>
                    </tr>
                  )}

                {orderDetail?.is_overdistance === 1 && (
                  <tr>
                    <td
                      className='text-end fw-bolder'
                      colSpan={
                        orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'survey'
                          ? 3
                          : orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                          ? 5
                          : 0
                      }
                    >
                      Biaya Tambahan
                    </td>
                    <td className=' fw-bolder'>{`Rp. ${parseInt(
                      orderDetail?.additional_fee ?? 0
                    ).toLocaleString('id')}`}</td>
                  </tr>
                )}

                {(orderDetail?.payment_type !== 'survey' || orderDetail?.is_overdistance === 1) && (
                  <tr>
                    <td
                      colSpan={
                        orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'survey'
                          ? 3
                          : orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                          ? 5
                          : 0
                      }
                      className='text-end fw-bolder'
                    >
                      Grand Total
                    </td>

                    <td className=' fw-bolder'>{calculateTotal(orderDetail)}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Skeleton>

          <Skeleton loading={isLoadingPage}>
            <div className='detail-customer mb-5'>
              <h3 className='fs-3 fw-bold mb-3'>Detail Customer</h3>

              <Row className='detail-member mb-5'>
                <h3 className='fs-5 fw-normal mb-1'>
                  Nama Customer :{' '}
                  <span className='fs-5 fw-semibold mb-1'> {orderDetail?.members?.full_name}</span>
                </h3>

                <h3 className='fs-5 fw-normal mb-1'>
                  Alamat :{' '}
                  <span className='fs-5 fw-semibold mb-1'> {orderDetail?.project_address}</span>
                </h3>

                <h3 className='fs-5 fw-normal mb-1'>
                  Telp :{' '}
                  <span className='fs-5 fw-semibold mb-1'> {orderDetail?.project_number}</span>
                </h3>
              </Row>
            </div>
          </Skeleton>

          {/* 
          <Skeleton active loading={isLoadingPage}>
            <div className='mb-5'>
              <table className='detail-item'>
                <thead>
                  <tr>
                    <th className='table-head-name text-uppercase'>Deskripsi Pemasangan</th>
                    <th className='table-head-qty text-uppercase'>QTY</th>
                    {!(
                      orderDetail?.payment_type === 'gratis' ||
                      orderDetail?.payment_type === 'survey'
                    ) && (
                      <>
                        <th className='table-head-price text-uppercase'>Harga Jasa</th>
                        <th className='table-head-subtotal text-end text-uppercase'>Jumlah</th>
                      </>
                    )}
                  </tr>
                </thead>
              </table>

              <hr className='line-1' />
              <hr className='line-1' />

              <table className='detail-item'>
                <tbody>
                  {orderDetail?.order_details?.map((item: any, index: any) => (
                    <tr>
                      <td className='table-content-name'>
                        {orderDetail?.payment_type === 'survey'
                          ? item?.item_notes
                          : item?.item?.service_name}
                      </td>

                      <td className='table-content-qty'>{`${item?.quantity ?? 0} x`}</td>

                      {!(
                        orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'survey'
                      ) && (
                        <>
                          <td className='table-content-price'>{`Rp. ${parseInt(
                            item?.unit_price ?? 0
                          )?.toLocaleString('id')}`}</td>

                          <td className='table-content-subtotal text-end'>{`Rp. ${parseInt(
                            item?.total ?? 0
                          )?.toLocaleString('id')}`}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr className='line-2' />

              <table className='detail-item'>
                <tbody>
                  {orderDetail?.payment_type !== 'gratis' &&
                    orderDetail?.payment_type !== 'pemasangan_tanpa_survey' && (
                      <tr>
                        <td className='table-footer-1'>Biaya Survey</td>
                        <td className='table-footer-2'>:</td>
                        <td className='table-footer-3 text-end'>
                          {orderDetail?.payment_type === 'gratis' ||
                          orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                            ? `Rp. ${(0).toLocaleString('id')}`
                            : orderDetail?.payment_type === 'survey'
                            ? `Rp. ${(99000).toLocaleString('id')}`
                            : `Rp. ${0}`}
                        </td>
                      </tr>
                    )}

                  {orderDetail?.is_overdistance === 1 && (
                    <tr>
                      <td className='table-footer-1'>Biaya Tambahan</td>
                      <td className='table-footer-2'>:</td>
                      <td className='table-footer-3 text-end'>{`Rp. ${parseInt(
                        orderDetail?.additional_fee ?? 0
                      ).toLocaleString('id')}`}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <table className='detail-item'>
                <tbody>
                  <tr>
                    <td className='table-footer-4'></td>

                    <td className='table-footer-5 fw-bold'>
                      {orderDetail?.is_overdistance === 1 ||
                        (orderDetail?.payment_type === 'survey' && <hr className='line-2' />)}
                      Grand Total :
                    </td>

                    <td className='table-footer-6 text-end fw-bold'>
                      {orderDetail?.is_overdistance === 1 ||
                        (orderDetail?.payment_type === 'survey' && <hr className='line-2' />)}

                      {calculateTotal(orderDetail)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Skeleton> */}

          <Skeleton active loading={isLoadingPage}>
            <Row>
              <Col>
                <h3 className='fs-3 fw-bold mb-1'>Syarat & Ketentuan</h3>

                <ol>
                  <li className='fw-normal'>
                    Jadwal survey/pengerjaan akan ditentukan oleh teknisi, setelah material tersedia
                    dan barang diterima customer, serta barang yang akan dikerjakan jasa instalasi
                    adalah barang dari Mitra10.
                  </li>

                  <li className='fw-normal'>
                    Penjadwalan ulang pada H-1 tidak dikenakan biaya, penjadwalan ulang pada hari H
                    akan dikenakan biaya tambahan minimal sebesar Rp 75.000.
                  </li>

                  <li className='fw-normal'>
                    Pekerjaan tambahan (Pekerjaan diluar yang sudah diajukan & di transaksikan) akan
                    dikenakan biaya tambahan.
                  </li>

                  <li className='fw-normal'>
                    Semua jasa pemasangan wajib dilakukan survey. Biaya survey akan dikembalikan
                    apabila biaya jasa instalasi/service minimal Rp 500.000.
                  </li>

                  <li className='fw-normal'>
                    Quotation diberikan kepada customer maksimal H+2 hari kerja setelah survey
                    selesai.
                  </li>

                  <li className='fw-normal'>
                    Garansi 7 (Tujuh) hari untuk instalasi/service terhitung sejak tanggal serah
                    terima pekerjaan dan hanya 1x kunjungan. Kerusakan produk yang terpasang, tidak
                    menjadi bagian garansi dan proses instalasi/service.
                  </li>

                  <li className='fw-normal'>
                    Biaya transportasi, jarak dari toko Mitra10 lokasi pengerjaan kurang dari 10KM
                    adalah FREE : Lebih dari 10KM dikenakan biaya transportasi Rp 25.000 Max 40KM
                  </li>
                </ol>
              </Col>
            </Row>
          </Skeleton>

          <Skeleton active loading={isLoadingPage}>
            <Row>
              <Col>
                <h3 className='fs-3 fw-bold mb-1'>Informasi</h3>

                <ol>
                  <li className='fw-normal'>
                    Kontak layanan pelanggan Instalasi/Service (WA Only) : 0878-8482-1089.
                  </li>

                  <li className='fw-normal'>
                    Operasional hari senin s/d jumat - Office hour 09:00 s/d 16:00.
                  </li>

                  <li className='fw-normal'>
                    Orderan instalasi/service yang masuk diluar jam operasional akan diproses pada
                    jam operasional.
                  </li>
                </ol>
              </Col>
            </Row>
          </Skeleton>

          <Skeleton active loading={isLoadingPage}>
            <div className='payment-bank mb-3'>
              <h3 className='fs-5 fw-semibold mb-2'>
                Silahkan melakukan pembayaran di account di bawah ini :
              </h3>
              <h3 className='fs-5 fw-normal'>{orderDetail?.store?.bank_account}</h3>
              <h3 className='fs-5 fw-normal'>{orderDetail?.store?.bank_name}</h3>
              <h3 className='fs-5 fw-normal'>{orderDetail?.store?.bank_number}</h3>
            </div>
          </Skeleton>

          <Skeleton active loading={isLoadingPage}>
            <div className='store-information mb-5'>
              <h3 className='fs-5 fw-semibold mb-2'>Silahkan kirim bukti bayar anda melalui :</h3>
              <h3 className='fs-5 fw-normal'>
                {`Telp : ${
                  orderDetail?.store?.phone_number_1 ??
                  orderDetail?.store?.phone_number_2 ??
                  'Nomor telepon belum tersedia'
                }`}
              </h3>
              <h3 className='fs-5 fw-normal'>
                {`Email : ${
                  orderDetail?.store?.email ?? orderDetail?.store?.email ?? 'Email belum tersedia'
                }`}
              </h3>
            </div>

            <div className='footer-card'>
              <h1 className='fs-3 fw-semibold'>Hormat Kami, Mitra10</h1>
            </div>
          </Skeleton>

          <div className='button-wrapper d-flex justify-content-center align-items-center mt-5'>
            <Button className='hide-print-button' variant='dark-danger' onClick={handleCancelPrint}>
              Cancel
            </Button>

            <Button className='hide-print-button' variant='dark-primary' onClick={handlePrintOrder}>
              {orderDetail?.print_counter < 1 ? 'Print' : 'Reprint'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {PrintoutOrderCS}
