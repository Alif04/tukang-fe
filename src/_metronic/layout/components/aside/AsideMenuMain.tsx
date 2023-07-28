/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

export function AsideMenuMain() {
  const navigate = useNavigate()

  const logoutHandler = () => {
    localStorage.clear()

    Swal.fire({
      icon: 'success',
      title: 'Logout Success',
      text: 'You have been logged out successfully.',
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      navigate('/auth')
    })

    console.log('Logout Successful')
  }

  return (
    <>
      {/* Halaman Home */}
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title='Home'
        fontIcon='bi-app-indicator'
        role={['admin-store', 'admin-ho', 'admin-vendor', 'admin-tukang']}
      />

      {/* Halaman Order */}
      <AsideMenuItemWithSub
        to='/order'
        title='Order'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
        role={['admin-store', 'admin-ho']}
      >
        <AsideMenuItem
          to='/order/view-order'
          title='View Order'
          role={['admin-store', 'admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/order/new-order'
          title='New Order'
          role={['admin-store', 'admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/order/update-order'
          title='Update Order'
          role={['admin-store', 'admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/order/report-order'
          title='Report Order'
          role={['admin-store', 'admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Work Order */}
      <AsideMenuItemWithSub
        to='/work-order'
        title='Work Order'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
        role={['admin-vendor', 'admin-tukang']}
      >
        <AsideMenuItem
          to='/work-order/view-work-order'
          title='View Work Order'
          role={['admin-vendor', 'admin-tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/work-order/report-work-order'
          title='Report Work Order'
          hasBullet={true}
          role={['admin-vendor', 'admin-tukang']}
        />
        <AsideMenuItem
          to='/work-order/update-work-order'
          title='Update Work Order'
          hasBullet={true}
          role={['admin-vendor', 'admin-tukang']}
        />
        <AsideMenuItem
          to='/work-order/detail-work-order'
          title='Detail Work Order'
          hasBullet={true}
          role={['admin-vendor', 'admin-tukang']}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Tukang */}
      <AsideMenuItemWithSub
        to='/tukang'
        title='Tukang'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
        role={['admin-vendor', 'admin-tukang']}
      >
        <AsideMenuItem
          to='/tukang/view-tukang'
          title='View Tukang'
          role={['admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/tukang/new-tukang'
          title='New Tukang'
          role={['admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/tukang/update-tukang'
          title='Update Tukang'
          role={['admin-vendor', 'admin-tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/tukang/detail-tukang'
          title='Detail Tukang'
          role={['admin-vendor', 'admin-tukang']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Costumers */}
      <AsideMenuItemWithSub
        to='/costumers'
        title='Costumers'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho']}
      >
        <AsideMenuItem
          to='/costumers/view-costumers'
          title='View Costumers'
          role={['admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/costumers/report-costumers'
          title='Report Costumers'
          role={['admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman CSI */}
      <AsideMenuItemWithSub
        to='/cis'
        title='CSI'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho']}
      >
        <AsideMenuItem to='/csi/view-csi' title='View CSI' role={['admin-ho']} hasBullet={true} />
        <AsideMenuItem to='/csi/new-csi' title='New CSI' role={['admin-ho']} hasBullet={true} />
        <AsideMenuItem
          to='/csi/update-csi'
          title='Update CSI'
          role={['admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/csi/report-csi'
          title='Report CSI'
          role={['admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Vendor */}
      <AsideMenuItemWithSub
        to='/vendor'
        title='Vendor'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho']}
      >
        <AsideMenuItem
          to='/vendor/view-vendor'
          title='View Vendor'
          role={['admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/vendor/new-vendor'
          title='New Vendor'
          role={['admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/vendor/update-vendor'
          title='Update Vendor'
          role={['admin-ho']}
          hasBullet={true}
        />
        {/* <AsideMenuItem
          to='/vendor/detail-vendor'
          title='Detail Vendor'
          role={['admin-ho']}
          hasBullet={true}
        /> */}
        <AsideMenuItem
          to='/vendor/report-vendor'
          title='Report Vendor'
          role={['admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Quotation */}
      <AsideMenuItemWithSub
        to='/quotation'
        title='Quotation'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho', 'admin-vendor']}
      >
        <AsideMenuItem
          to='/quotation/view-quotation'
          title='View Quotation'
          role={['admin-ho', 'admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/quotation/new-quotation'
          title='New Quotation'
          role={['admin-ho', 'admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/quotation/update-quotation'
          title='Update Quotation'
          role={['admin-ho', 'admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/quotation/detail-quotation'
          title='Detail Quotation'
          role={['admin-ho', 'admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/quotation/report-finance'
          title='Dashboard Finance'
          role={['admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Invoice */}
      <AsideMenuItemWithSub
        to='/invoice'
        title='Invoice'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho', 'admin-vendor']}
      >
        <AsideMenuItem
          to='/invoice/view-invoice'
          title='View Invoice'
          role={['admin-ho', 'admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/invoice/new-invoice'
          title='New Invoice'
          role={['admin-vendor']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/invoice/detail-invoice'
          title='Detail Invoice'
          role={['admin-vendor']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Complaint */}
      <AsideMenuItemWithSub
        to='/complaint'
        title='Complaint'
        role={['admin-store', 'admin-ho', 'admin-vendor', 'admin-tukang']}
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem
          to='/complaint/view-complaint'
          title='View Complaint'
          role={['admin-store', 'admin-ho', 'admin-vendor', 'admin-tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/complaint/new-complaint'
          title='New Complaint'
          role={['admin-store', 'admin-ho', 'admin-vendor', 'admin-tukang']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/complaint/report-complaint'
          title='Report Complaint'
          role={['admin-store', 'admin-ho', 'admin-vendor', 'admin-tukang']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Reports */}
      <AsideMenuItemWithSub
        to='/reports'
        title='Reports'
        role={['admin-store']}
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem
          to='/reports/view-report'
          title='Report List'
          role={['admin-store']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Payment */}
      <AsideMenuItemWithSub
        to='/payment'
        title='Payment'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho']}
      >
        <AsideMenuItem
          to='/payment/view-payment'
          title='View Payment'
          role={['admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/payment/new-payment'
          title='New Payment'
          role={['admin-ho']}
          hasBullet={true}
        />
        <AsideMenuItem
          to='/payment/detail-payment'
          title='Detail Payment'
          role={['admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Refund */}
      <AsideMenuItemWithSub
        to='/refund'
        title='Refund'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
        role={['admin-ho']}
      >
        <AsideMenuItem
          to='/refund/view-refund'
          title='View Refund'
          role={['admin-ho']}
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      {/* Halaman Setting */}
      <AsideMenuItem
        to='/setting'
        icon='/media/icons/duotune/art/art002.svg'
        title='Setting'
        fontIcon='bi-app-indicator'
        role={['admin-store', 'admin-ho', 'admin-vendor', 'admin-tukang']}
      />

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
