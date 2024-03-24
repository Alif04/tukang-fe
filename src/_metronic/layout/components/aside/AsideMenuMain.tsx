/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import Swal from 'sweetalert2'

export function AsideMenuMain() {
  const userRole = localStorage.getItem('userRole')

  const logoutHandler = () => {
    localStorage.clear()
    sessionStorage.clear()

    Swal.fire({
      icon: 'success',
      title: 'Logout Success',
      text: 'You have been logged out successfully.',
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
      document.location.href = '/login'
    })

    console.log('Logout Successful')
  }

  // Delete Local Storage after 1 day
  const deleteLocalStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  setTimeout(deleteLocalStorage, 24 * 60 * 60 * 1000)

  return (
    <>
      {/* Halaman Home */}
      <AsideMenuItem
        to='/home'
        icon='/media/icons/duotune/art/art002.svg'
        title='Home ( Dashboard )'
        fontIcon='bi-app-indicator'
        role={['Store CS', 'Store Staff', 'Sales', 'Admin HO', 'Admin Vendor', 'Tukang']}
      />

      {/* Halaman Calendar */}
      {/* <AsideMenuItem
        to='/calendar/view-calendar'
        icon='/media/icons/duotune/art/art002.svg'
        title='Kalender Kerja'
        fontIcon='bi-app-indicator'
        role={['Tukang']}
      /> */}

      {/* Halaman Order */}
      <AsideMenuItemWithSub
        to='/order'
        title='Order'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
        role={['Store CS', 'Store Staff', 'Sales', 'Admin HO']}
      >
        <AsideMenuItem
          to='/order/dashboard-order'
          title='Order Summary'
          role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/warranty/claim-warranty-list'
          title='Claim Garansi'
          role={['Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/calendar/view-calendar'
          title={userRole === 'Admin HO' ? 'Kalender Order' : 'Kalender Instalasi'}
          role={['Store CS', 'Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem to='/csi/view-csi' title='List CSI' role={['Admin HO']} hasBullet={true} />

        <AsideMenuItem
          to='/order/view-order'
          title='List Order'
          role={['Store CS', 'Store Staff', 'Sales', 'Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/order/new-order'
          title='Order Baru'
          role={['Sales', 'Store Staff', 'Sales', 'Store CS', 'Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Work Order */}
      <AsideMenuItemWithSub
        to='/work-order'
        title='Work Order'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
        role={['Admin Vendor', 'Tukang']}
      >
        <AsideMenuItem
          to='/warranty/claim-warranty-list'
          title='Claim Garansi'
          role={['Admin Vendor', 'Tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/calendar/view-calendar'
          title='Kalender Order'
          hasBullet={true}
          role={['Admin Vendor', 'Tukang']}
        />
        <AsideMenuItem
          to='/work-order/view-work-order'
          title='List Work Order'
          role={['Admin Vendor', 'Tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/work-order/report-work-order'
          title='Report Work Order'
          hasBullet={true}
          role={['Admin Vendor']}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Quotation */}
      <AsideMenuItemWithSub
        to='/quotation'
        title='Quotation'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO', 'Admin Vendor']}
      >
        <AsideMenuItem
          to='/quotation/new-quotation'
          title='New Quotation'
          role={['Admin Vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/quotation/view-quotation'
          title='Quotation List'
          role={['Admin HO', 'Admin Vendor']}
          hasBullet={true}
        />
        {/* <AsideMenuItem
          to='/quotation/report-finance'
          title='Dashboard Finance'
          role={['Admin HO']}
          hasBullet={true}
        /> */}
      </AsideMenuItemWithSub>

      {/* Halaman Pengaduan */}
      <AsideMenuItemWithSub
        to='/complaint'
        title='Pengaduan'
        role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem
          to='/complaint/report-complaint'
          title='Pengaduan Summary'
          role={['Store CS', 'Admin Vendor', 'Tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/warranty/claim-warranty-list'
          title='Claim Garansi'
          role={['Store CS']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/complaint/view-complaint'
          title='List Pengaduan'
          role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/complaint/new-complaint'
          title='Request Pengaduan'
          role={['Store CS', 'Admin HO', 'Admin Vendor']}
          hasBullet={true}
        />

        <AsideMenuItemWithSub
          to='/reschedule'
          title='Reschedule'
          hasBullet={true}
          role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
        >
          <AsideMenuItem
            to='/reschedule/new-reschedule'
            title='New Reschedule'
            role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
            hasBullet={true}
          />

          <AsideMenuItem
            to='/reschedule/view-reschedule'
            title='View Reschedule'
            role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>

      {/* Halaman Tukang */}
      <AsideMenuItemWithSub
        to='/tukang'
        title='Tukang'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
        role={['Admin Vendor']}
      >
        <AsideMenuItem
          to='/tukang/view-tukang'
          title='List Tukang'
          role={['Admin Vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/tukang/new-tukang'
          title='New Tukang'
          role={['Admin Vendor']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Sales */}
      {/* <AsideMenuItemWithSub
        to='/sales'
        title='Sales'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO']}
      >
        <AsideMenuItem
          to='/sales/view-sales'
          title='List Sales'
          role={['Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/sales/new-sales'
          title='Register Sales'
          role={['Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub> */}

      {/* Halaman Vendor */}
      <AsideMenuItemWithSub
        to='/vendor'
        title='Vendor'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO']}
      >
        <AsideMenuItem
          to='/vendor/report-vendor'
          title='Vendor Summary'
          role={['Admin HO']}
          hasBullet={true}
        />
        {/* <AsideMenuItem
          to='/tukang/view-tukang'
          title='List Tukang'
          role={['Admin HO']}
          hasBullet={true}
        /> */}
        <AsideMenuItem
          to='/vendor/view-vendor'
          title='List Vendor'
          role={['Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/vendor/new-vendor'
          title='Register Vendor'
          role={['Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Costumers */}
      <AsideMenuItemWithSub
        to='/costumers'
        title='Customers'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO']}
      >
        <AsideMenuItem
          to='/costumers/report-costumers'
          title='Report Customers'
          role={['Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/costumers/new-costumers'
          title='Register Customers'
          role={['Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/costumers/view-costumers'
          title='View Customers'
          role={['Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman CSI */}
      {/* <AsideMenuItemWithSub
        to='/cis'
        title='CSI'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO']}
      >
        <AsideMenuItem to='/csi/view-csi' title='List CSI' role={['Admin HO']} hasBullet={true} />
        <AsideMenuItem to='/csi/new-csi' title='New CSI' role={['Admin HO']} hasBullet={true} />
        <AsideMenuItem
          to='/csi/update-csi'
          title='Update CSI'
          role={['Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/csi/report-csi'
          title='Report CSI'
          role={['Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub> */}

      {/* Halaman Item */}
      {/* <AsideMenuItemWithSub
        to='/item'
        title='Item'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO']}
      >
        <AsideMenuItem
          to='/item/view-item'
          title='List Item'
          role={['Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub> */}

      {/* Halaman Invoice */}
      <AsideMenuItemWithSub
        to='/invoice'
        title='Invoice'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO', 'Admin Vendor']}
      >
        <AsideMenuItem
          to='/invoice/view-invoice'
          title='List Invoice'
          role={['Admin HO', 'Admin Vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/invoice/new-invoice'
          title='New Invoice'
          role={['Admin Vendor']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Reports */}
      <AsideMenuItemWithSub
        to='/reports'
        title={
          userRole === 'Store CS' || userRole === 'Store Staff' || userRole === 'Sales'
            ? 'Laporan'
            : 'Report'
        }
        role={['Store CS', 'Store Staff', 'Sales', 'Admin HO', 'Admin Vendor', 'Tukang']}
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem
          to='/reports/report-insentif'
          title={userRole === 'Admin HO' ? 'Insentif Sales' : 'Insentif'}
          role={['Store CS', 'Store Staff', 'Sales', 'Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/reports/view-report'
          title={userRole === 'StoreCS' ? 'List Laporan' : 'Performance'}
          role={['Store CS', 'Admin HO', 'Admin Vendor', 'Tukang']}
          hasBullet={true}
        />

        {/* <AsideMenuItem
          to='/reports/report-performance'
          title='Performance'
          role={['Store CS']}
          hasBullet={true}
        /> */}
      </AsideMenuItemWithSub>

      {/* Halaman Payment */}
      <AsideMenuItemWithSub
        to='/payment'
        title='Payment'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Admin HO']}
      >
        <AsideMenuItem
          to='/payment/view-payment'
          title='List Payment'
          role={['Admin HO']}
          hasBullet={true}
        />

        {/* <AsideMenuItem
          to='/payment/new-payment'
          title='New Payment'
          role={['Admin HO']}
          hasBullet={true}
        /> */}

        {/* <AsideMenuItem
          to='/payment/detail-payment'
          title='Detail Payment'
          role={['Admin HO']}
          hasBullet={true}
        /> */}
      </AsideMenuItemWithSub>

      {/* Halaman Refund */}
      <AsideMenuItemWithSub
        to='/refund'
        title='Refund'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['Store CS', 'Admin HO']}
      >
        <AsideMenuItem
          to='/refund/new-refund'
          title='New Refund'
          role={['Store CS', 'Admin HO']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/refund/view-refund'
          title='View Refund'
          role={['Store CS', 'Admin HO']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Setting */}
      <AsideMenuItemWithSub
        to='/setting'
        icon='/media/icons/duotune/art/art002.svg'
        title={userRole === 'Store CS' || userRole === 'Sales' ? 'Pengaturan' : 'Setting'}
        fontIcon='bi-app-indicator'
        role={['Store CS', 'Sales', 'Admin HO', 'Admin Vendor']}
      >
        <AsideMenuItemWithSub to='/bank' title='Bank' hasBullet={true} role={['Admin HO']}>
          <AsideMenuItem
            to='/bank/view-bank'
            title='Daftar Bank'
            role={['Admin HO']}
            hasBullet={true}
          />
          <AsideMenuItem
            to='/bank/new-bank'
            title='Register Bank'
            role={['Admin HO']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/email' title='Format Email' hasBullet={true} role={['Admin HO']}>
          <AsideMenuItem
            to='/email/format-email'
            title='Format Email'
            role={['Admin HO']}
            hasBullet={true}
          />

          <AsideMenuItem
            to='/email/view-format-email'
            title='Daftar Format Email'
            role={['Admin HO']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItem
          to='/csi/format-pertanyaan-csi'
          title='Format Pertanyaan CSI'
          role={['Admin HO']}
          hasBullet={true}
        />

        <AsideMenuItem
          to='/sales/new-sales'
          title='Register Sales'
          role={['Store CS']}
          hasBullet={true}
        />

        <AsideMenuItemWithSub to='/item' title='Item' hasBullet={true} role={['Admin HO']}>
          <AsideMenuItem
            to='/item/view-item'
            title='Daftar Item'
            role={['Admin HO']}
            hasBullet={true}
          />

          <AsideMenuItem
            to='/item/new-item'
            title='Set Items'
            role={['Admin HO']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/sales' title='Sales' role={['Admin HO']} hasBullet={true}>
          <AsideMenuItem
            to='/sales/new-sales'
            title='Register Sales'
            role={['Admin HO']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/store' title='Store' hasBullet={true} role={['Admin HO']}>
          <AsideMenuItem
            to='/store/view-store'
            title='Daftar Store'
            role={['Admin HO']}
            hasBullet={true}
          />
          <AsideMenuItem
            to='/store/new-store'
            title='Register Store'
            role={['Admin HO']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        {/* <AsideMenuItemWithSub to='/tukang' title='Tukang' hasBullet={true} role={['Admin HO']}>
          <AsideMenuItem
            to='/tukang/view-tukang'
            title='List Tukang'
            role={['Admin HO']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub> */}

        {/* <AsideMenuItem
          to='/item/view-item'
          title='List Items'
          role={['Admin HO']}
          hasBullet={true}
        /> */}

        <AsideMenuItemWithSub
          to='/material'
          title='Material'
          hasBullet={true}
          role={['Admin Vendor']}
        >
          {/* <AsideMenuItem
            to='/material/view-material'
            title='List Material'
            role={['Admin Vendor']}
            hasBullet={true}
          /> */}
          <AsideMenuItem
            to='/material/new-material'
            title='New Material'
            role={['Admin Vendor']}
            hasBullet={true}
          />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>

      {/* Logout */}
      <div className='menu-item'>
        <a className='menu-link' onClick={logoutHandler}>
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Logout</span>
        </a>
      </div>

      {/* <AsideMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'
      >
        <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub>

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      >
        <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItem
        to='/apps/user-management/users'
        icon='/media/icons/duotune/general/gen051.svg'
        title='User management'
        fontIcon='bi-layers'
      /> */}
    </>
  )
}
