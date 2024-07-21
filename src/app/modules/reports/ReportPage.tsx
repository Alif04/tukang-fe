import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ReportTukang, ReportVendor, TotalOrderReportStore} from '../../components'
import {ReportHO} from '../../components'

import {PrintReport} from './components/PrintReport'
import {ViewReport} from './components/ViewReport'
import {ReportPerformanceList} from './components/ReportPerformanceList'
import {ReportInsentifList} from './components/ReportInsentifList'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Reports',
    path: '/reports/view-report',
    isSeparator: false,
    isActive: false,
  },
]

const RefundPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-report'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>LIST LAPORAN</PageTitle>
            <ViewReport />
          </>
        }
      />

      <Route
        path='report-insentif'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN INSENTIF</PageTitle>
            <ReportInsentifList />
          </>
        }
      />

      <Route
        path='report-performance'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PERFORMANCE</PageTitle>
            <ReportPerformanceList />
          </>
        }
      />

      {/* STORE REPORT */}

      <Route
        path='report-total-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL ORDER</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN TOTAL ORDER'
              isWorkOrder={false}
              endpoint='orders'
              className=''
              params=''
              statusName={['']}
            />
          </>
        }
      />

      <Route
        path='report-pending-survey'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PERMINTAAN SURVEI</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN PERMINTAAN SURVEI'
              isWorkOrder={false}
              endpoint='orders'
              className=''
              params=''
              statusName={['SURVEYREQ']}
            />
          </>
        }
      />

      <Route
        path='report-survey'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN SURVEI DIMULAI</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN SURVEI DIMULAI'
              isWorkOrder={false}
              endpoint='orders'
              className=''
              params=''
              statusName={['SURVEYSTART']}
            />
          </>
        }
      />

      <Route
        path='report-pending-quotation'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              LAPORAN QUOTATION DIKIRIM KE KONSUMEN
            </PageTitle>
            <TotalOrderReportStore
              title='LAPORAN QUOTATION DIKIRIM KE KONSUMEN'
              isWorkOrder={false}
              endpoint='quotation'
              className=''
              params=''
              statusName={['QUOTEOUT']}
            />
          </>
        }
      />

      <Route
        path='report-pending-bayar'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN QUOTATION TELAH DIBAYAR</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN MENUNGGU BAYAR QUOTATION'
              isWorkOrder={false}
              endpoint='quotation'
              className=''
              params='&is_paid=1'
              statusName={['QUOTEOUT']}
            />
          </>
        }
      />

      <Route
        path='report-on-progress'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN SEDANG/PROSES PENGERJAAN</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN SEDANG PENGERJAAN'
              isWorkOrder={true}
              endpoint='orders'
              className=''
              params=''
              statusName={['WORKSTART', 'WORKEND']}
            />
          </>
        }
      />

      <Route
        path='report-complete'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER SELESAI</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN ORDER SELESAI'
              isWorkOrder={true}
              endpoint='orders'
              className=''
              params=''
              statusName={['WORKEND', 'DONE']}
            />
          </>
        }
      />

      <Route
        path='report-reschedule'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER RESCHEDULE</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN ORDER RESCHEDULE'
              isWorkOrder={false}
              endpoint='reschedule'
              className=''
              params=''
              statusName={['']}
            />
          </>
        }
      />

      <Route
        path='report-cancel'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER DIBATALKAN</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN ORDER DIBATALKAN'
              isWorkOrder={false}
              endpoint='orders'
              className=''
              params=''
              statusName={['CANCEL']}
            />
          </>
        }
      />

      <Route
        path='report-refund'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER REFUND</PageTitle>
            <TotalOrderReportStore
              title='LAPORAN ORDER REFUND'
              isWorkOrder={false}
              endpoint='refund'
              className=''
              params=''
              statusName={['']}
            />
          </>
        }
      />

      {/* HO REPORT */}
      <Route
        path='ho-report-transaksi-all'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TRANSAKSI ALL ( OMSET )</PageTitle>

            <ReportHO
              endpoint='orders'
              statusName=''
              headerColor='success'
              title='Laporan Transaksi All ( Omset )'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-survey'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN SURVEY ( OMSET )</PageTitle>

            <ReportHO
              endpoint='orders'
              statusName='SURVEY'
              headerColor='success'
              title='Laporan Survey ( Omset )'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-quotation'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN QUOTATION ( OMSET )</PageTitle>

            <ReportHO
              endpoint='quotation'
              statusName=''
              headerColor='success'
              title='Laporan Quotation ( Omset )'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-pending-payment'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENDING PAYMENT ( OMSET )</PageTitle>

            <ReportHO
              endpoint='invoices'
              statusName=''
              headerColor='danger'
              title='Laporan Pending Payment ( Omset )'
              params='&invoice_status=1'
            />
          </>
        }
      />

      <Route
        path='ho-report-on-progress'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ON PROGRESS ( OMSET )</PageTitle>

            <ReportHO
              endpoint='orders'
              statusName='WORKSTART'
              headerColor='primary'
              title='Laporan On Progress ( Omset )'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-reschedule'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN RESCHEDULE ( OMSET )</PageTitle>

            <ReportHO
              endpoint='reschedule'
              statusName=''
              headerColor='primary'
              title='Laporan Reschedule ( Omset )'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-complaint'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENGADUAN</PageTitle>

            <ReportHO
              endpoint='complaints'
              statusName=''
              headerColor='danger'
              title='Laporan Pengaduan '
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-claim-garansi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN GARANSI</PageTitle>

            <ReportHO
              endpoint='complaints'
              statusName='WARRANTYCLAIM'
              headerColor='primary'
              title='Laporan Garansi '
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-expense-promosi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN EXPENSE PROMOSI</PageTitle>

            <ReportHO
              endpoint='quotation'
              statusName=''
              headerColor='danger'
              title='Laporan Expense Promosi '
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-refund'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN REFUND</PageTitle>

            <ReportHO
              endpoint='refund'
              statusName=''
              headerColor='success'
              title='Laporan Refund'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-other-income'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN OTHER INCOME</PageTitle>

            <ReportHO
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Other Income'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-total-penalty'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL PENALTY</PageTitle>

            <ReportHO
              endpoint='refund'
              statusName=''
              headerColor='danger'
              title='Laporan Total Penalty'
              params='&penalty_vendor=1'
            />
          </>
        }
      />

      <Route
        path='ho-report-claim-voucher'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN CLAIM VOUCHER</PageTitle>

            <ReportHO
              endpoint='refund'
              statusName=''
              headerColor='success'
              title='Laporan Claim Voucher'
              params='&claim_voucher=1'
            />
          </>
        }
      />

      <Route
        path='ho-report-tagihan-bulanan'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN BULANAN</PageTitle>

            <ReportHO
              endpoint='invoices'
              statusName=''
              headerColor='success'
              title='Laporan Tagihan Bulanan'
              params=''
            />
          </>
        }
      />

      {/* <Route
        path='ho-report-pending-payment'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENDING PAYMENT ( OMSET )</PageTitle>

            <ReportHO
              endpoint='invoices'
              statusName=''
              headerColor='danger'
              title='Laporan Pending Payment ( Omset )'
              params='&invoice_status=1'
            />
          </>
        }
      /> */}

      <Route
        path='ho-report-paid'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN DIBAYAR</PageTitle>

            <ReportHO
              endpoint='invoices'
              statusName=''
              headerColor='success'
              title='Laporan Tagihan Dibayar'
              params='&invoice_status=6'
            />
          </>
        }
      />

      <Route
        path='ho-report-unpaid'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN BELUM DIBAYAR</PageTitle>

            <ReportHO
              endpoint='invoices'
              statusName=''
              headerColor='warning'
              title='Laporan Tagihan Belum Dibayar'
              params='&invoice_status=5'
            />
          </>
        }
      />

      <Route
        path='ho-report-csi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN CSI TERKIRIM</PageTitle>

            <ReportHO
              endpoint='orders'
              statusName=''
              headerColor='success'
              title='Laporan CSI Terkirim'
              params='&sent_csi=1'
            />
          </>
        }
      />

      <Route
        path='ho-report-unsent-csi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN CSI BELUM TERKIRIM</PageTitle>

            <ReportHO
              endpoint='orders'
              statusName=''
              headerColor='danger'
              title='Laporan CSI Belum Terkirim'
              params='&sent_csi=0'
            />
          </>
        }
      />
      {/* 
      <Route
        path='ho-report-csi-responded'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN CSI DIRESPON</PageTitle>

            <ReportHO
              endpoint='csi'
              statusName=''
              headerColor='success'
              title='Laporan CSI Direspon'
            />
          </>
        }
      />

      <Route
        path='ho-report-csi-unrespon'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN CSI BELUM DIRESPON</PageTitle>

            <ReportHO
              endpoint='csi'
              statusName=''
              headerColor='danger'
              title='Laporan CSI Belum Direspon'
            />
          </>
        }
      /> */}

      <Route
        path='ho-report-complete-order'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER SELESAI</PageTitle>

            <ReportHO
              endpoint='orders'
              statusName='WORKEND'
              headerColor='success'
              title='Laporan Order Selesai'
              params=''
            />
          </>
        }
      />

      {/* <Route
        path='ho-report-uncomplete-order'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER TIDAK KOMPLIT</PageTitle>

            <ReportHO
              endpoint=''
              statusName=''
              headerColor='danger'
              title='Laporan Order Tidak Komplit'
            />
          </>
        }
      /> */}

      <Route
        path='ho-report-insentive-paid'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN INSENTIVE DIBAYAR</PageTitle>

            <ReportHO
              endpoint='sales-comission'
              statusName='PAID'
              headerColor='success'
              title='Laporan Insentive Dibayar'
              params=''
            />
          </>
        }
      />

      <Route
        path='ho-report-insentive-unpaid'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN INSENTIVE BELUM DIBAYAR</PageTitle>

            <ReportHO
              endpoint='sales-comission'
              statusName='UNPAID'
              headerColor='danger'
              title='Laporan Insentive Belum Dibayar'
              params=''
            />
          </>
        }
      />

      {/* VENDOR REPORT */}
      <Route
        path='vendor-report-expense-promosi'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN EXPENSE PROMOSI</PageTitle>

            <ReportVendor
              endpoint='quotation'
              statusName=''
              headerColor='danger'
              title='Laporan Expense Promosi '
            />
          </>
        }
      />

      <Route
        path='vendor-report-other-income'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN OTHER INCOME</PageTitle>

            <ReportVendor
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Other Income'
            />
          </>
        }
      />

      <Route
        path='vendor-report-refund'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENALTY ATAS REFUND</PageTitle>

            <ReportVendor
              endpoint='refund'
              statusName=''
              headerColor='success'
              title='Laporan Penalty Atas Refund'
            />
          </>
        }
      />

      <Route
        path='vendor-report-pending-payment'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENDING PAYMENT</PageTitle>

            <ReportVendor
              endpoint='orders'
              statusName='UNPAID'
              headerColor='danger'
              title='Laporan Pending Payment '
            />
          </>
        }
      />

      <Route
        path='vendor-report-tagihan-bulanan'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN BULANAN</PageTitle>

            <ReportVendor
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Tagihan Bulanan'
            />
          </>
        }
      />

      <Route
        path='vendor-report-paid'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN DIBAYAR</PageTitle>

            <ReportVendor
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Tagihan Dibayar'
            />
          </>
        }
      />

      <Route
        path='vendor-report-unpaid'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN BELUM DIBAYAR</PageTitle>

            <ReportVendor
              endpoint=''
              statusName=''
              headerColor='warning'
              title='Laporan Tagihan Belum Dibayar'
            />
          </>
        }
      />

      <Route
        path='vendor-report-quotation'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN QUOTATION ( OMSET )</PageTitle>

            <ReportVendor
              endpoint='quotation'
              statusName=''
              headerColor='success'
              title='Laporan Quotation ( Omset )'
            />
          </>
        }
      />

      <Route
        path='vendor-report-survey'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN SURVEY ( OMSET )</PageTitle>

            <ReportVendor
              endpoint='orders'
              statusName=''
              headerColor='success'
              title='Laporan Survey ( Omset )'
            />
          </>
        }
      />

      <Route
        path='vendor-report-transaksi-all'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TRANSAKSI ALL ( OMSET )</PageTitle>

            <ReportVendor
              endpoint='orders'
              statusName=''
              headerColor='success'
              title='Laporan Transaksi All ( Omset )'
            />
          </>
        }
      />

      <Route
        path='vendor-report-pending-payment'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENDING PAYMENT ( OMSET )</PageTitle>

            <ReportVendor
              endpoint='orders'
              statusName='UNPAID'
              headerColor='danger'
              title='Laporan Pending Payment ( Omset )'
            />
          </>
        }
      />

      <Route
        path='vendor-report-claim-garansi'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL PINALTI</PageTitle>

            <ReportVendor
              endpoint='refund'
              statusName=''
              headerColor='primary'
              title='Laporan Total Pinalti '
            />
          </>
        }
      />

      <Route
        path='vendor-report-complaint'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENGADUAN</PageTitle>

            <ReportVendor
              endpoint='complaints'
              statusName=''
              headerColor='danger'
              title='Laporan Pengaduan '
            />
          </>
        }
      />

      <Route
        path='vendor-report-on-progress'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ON PROGRESS ( OMSET )</PageTitle>

            <ReportVendor
              endpoint='orders'
              statusName='WORKSTART'
              headerColor='primary'
              title='Laporan On Progress ( Omset )'
            />
          </>
        }
      />

      <Route
        path='vendor-report-reschedule'
        element={
          <>
            {userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN RESCHEDULE</PageTitle>

            <ReportVendor
              endpoint='reschedule'
              statusName=''
              headerColor='primary'
              title='Laporan Reschedule'
            />
          </>
        }
      />

      {/* TUKANG REPORT */}
      <Route
        path='tukang-report-expense-promosi'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN EXPENSE PROMOSI</PageTitle>

            <ReportTukang
              endpoint=''
              statusName=''
              headerColor='danger'
              title='Laporan Expense Promosi '
            />
          </>
        }
      />

      <Route
        path='tukang-report-other-income'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN OTHER INCOME</PageTitle>

            <ReportTukang
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Other Income'
            />
          </>
        }
      />

      <Route
        path='tukang-report-refund'
        element={
          <>
            {userRole === ' Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENALTY ATAS REFUND</PageTitle>

            <ReportTukang
              endpoint='refund'
              statusName=''
              headerColor='success'
              title='Laporan Penalty Atas Refund'
            />
          </>
        }
      />

      <Route
        path='tukang-report-pending-payment'
        element={
          <>
            {userRole === ' Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENDING PAYMENT</PageTitle>

            <ReportTukang
              endpoint='orders'
              statusName='UNPAID'
              headerColor='danger'
              title='Laporan Pending Payment '
            />
          </>
        }
      />

      <Route
        path='tukang-report-tagihan-bulanan'
        element={
          <>
            {userRole === ' Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN BULANAN</PageTitle>

            <ReportTukang
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Tagihan Bulanan'
            />
          </>
        }
      />

      <Route
        path='tukang-report-paid'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN DIBAYAR</PageTitle>

            <ReportTukang
              endpoint=''
              statusName=''
              headerColor='success'
              title='Laporan Tagihan Dibayar'
            />
          </>
        }
      />

      <Route
        path='tukang-report-unpaid'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TAGIHAN BELUM DIBAYAR</PageTitle>

            <ReportTukang
              endpoint=''
              statusName=''
              headerColor='warning'
              title='Laporan Tagihan Belum Dibayar'
            />
          </>
        }
      />

      <Route
        path='tukang-report-quotation'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN QUOTATION ( OMSET )</PageTitle>

            <ReportTukang
              endpoint='quotation'
              statusName=''
              headerColor='success'
              title='Laporan Quotation ( Omset )'
            />
          </>
        }
      />

      <Route
        path='tukang-report-survey'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN SURVEY ( OMSET )</PageTitle>

            <ReportTukang
              endpoint='orders'
              statusName='SURVEY'
              headerColor='success'
              title='Laporan Survey ( Omset )'
            />
          </>
        }
      />

      <Route
        path='tukang-report-transaksi-all'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TRANSAKSI ALL ( OMSET )</PageTitle>

            <ReportTukang
              endpoint='orders'
              statusName=''
              headerColor='success'
              title='Laporan Transaksi All ( Omset )'
            />
          </>
        }
      />

      <Route
        path='tukang-report-pending-payment'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENDING PAYMENT ( OMSET )</PageTitle>

            <ReportTukang
              endpoint='orders'
              statusName='UNPAID'
              headerColor='danger'
              title='Laporan Pending Payment ( Omset )'
            />
          </>
        }
      />

      <Route
        path='tukang-report-claim-garansi'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL PINALTI</PageTitle>

            <ReportTukang
              endpoint='orders'
              statusName='WARRANTYCLAIM'
              headerColor='primary'
              title='Laporan Total Pinalti'
            />
          </>
        }
      />

      <Route
        path='tukang-report-complaint'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENGADUAN</PageTitle>

            <ReportTukang
              endpoint='complaints'
              statusName=''
              headerColor='danger'
              title='Laporan Pengaduan '
            />
          </>
        }
      />

      <Route
        path='tukang-report-on-progress'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PENGERJAAN</PageTitle>

            <ReportTukang
              endpoint='work-orders'
              statusName=''
              headerColor='primary'
              title='Laporan Pengerjaan'
            />
          </>
        }
      />

      <Route
        path='tukang-report-reschedule'
        element={
          <>
            {userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN RESCHEDULE</PageTitle>

            <ReportTukang
              endpoint='reschedule'
              statusName=''
              headerColor='primary'
              title='Laporan Reschedule'
            />
          </>
        }
      />

      {/* PRINT REPORT  */}
      <Route
        path='print-report'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>PRINT REPORT</PageTitle>
            <PrintReport />
          </>
        }
      />

      <Route index element={<Navigate to='/reports/view-report' />} />
    </Routes>
  )
}

export default RefundPage
