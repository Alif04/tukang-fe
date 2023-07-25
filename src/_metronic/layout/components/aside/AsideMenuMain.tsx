/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title='Home'
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItemWithSub
        to='/order'
        title='Order'
        icon='/media/icons/duotune/art/art002.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/order/view-order' title='View Order' hasBullet={true} />
        <AsideMenuItem to='/order/new-order' title='New Order' hasBullet={true} />
        <AsideMenuItem to='/order/update-order' title='Update Order' hasBullet={true} />
        <AsideMenuItem to='/order/report-order' title='Report Order' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/costumers'
        title='Costumers'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/costumers/view-costumers' title='View Costumers' hasBullet={true} />
        <AsideMenuItem to='/costumers/report-costumers' title='Report Costumers' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/complaint'
        title='Complaint'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/complaint/view-complaint' title='View Complaint' hasBullet={true} />
        <AsideMenuItem to='/complaint/new-complaint' title='New Complaint' hasBullet={true} />
        <AsideMenuItem to='/complaint/report-complaint' title='Report Complaint' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/cis'
        title='CSI'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/csi/view-csi' title='View CSI' hasBullet={true} />
        {/* <AsideMenuItem to='/csi/new-csi' title='New CSI' hasBullet={true} /> */}
        <AsideMenuItem to='/csi/update-csi' title='Update CSI' hasBullet={true} />
        <AsideMenuItem to='/csi/report-csi' title='Report CSI' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/vendor'
        title='Vendor'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/vendor/view-vendor' title='View Vendor' hasBullet={true} />
        <AsideMenuItem to='/vendor/new-vendor' title='New Vendor' hasBullet={true} />
        <AsideMenuItem to='/vendor/update-vendor' title='Update Vendor' hasBullet={true} />
        <AsideMenuItem to='/vendor/detail-vendor' title='Detail Vendor' hasBullet={true} />
        <AsideMenuItem to='/vendor/report-vendor' title='Report Vendor' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/quotation'
        title='Quotation'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/quotation/view-quotation' title='View Quotation' hasBullet={true} />
        <AsideMenuItem to='/quotation/new-quotation' title='New Quotation' hasBullet={true} />
        <AsideMenuItem to='/quotation/update-quotation' title='Update Quotation' hasBullet={true} />
        <AsideMenuItem to='/quotation/detail-quotation' title='Detail Quotation' hasBullet={true} />
        <AsideMenuItem to='/quotation/report-finance' title='Dashboard Finance' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/payment'
        title='Payment'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/payment/view-payment' title='View Payment' hasBullet={true} />
        {/* <AsideMenuItem to='/payment/new-payment' title='New Payment' hasBullet={true} /> */}
        <AsideMenuItem to='/payment/detail-payment' title='Detail Payment' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/invoice'
        title='Invoice'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/invoice/view-invoice' title='View Invoice' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to='/refund'
        title='Refund'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/refund/view-refund' title='View Refund' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItem
        to='/setting'
        icon='/media/icons/duotune/art/art002.svg'
        title='Setting'
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/logout'
        icon='/media/icons/duotune/art/art002.svg'
        title='Logout'
        fontIcon='bi-app-indicator'
      />

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
      />
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}
