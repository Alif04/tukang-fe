/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {useLayout} from '../../core'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'

const AsideDefault: FC = () => {
  const {config, classes} = useLayout()
  const asideRef = useRef<HTMLDivElement | null>(null)
  const {aside} = config

  const username = localStorage.getItem('username')
  const fullName = localStorage.getItem('employeeName')
  const vendorName = localStorage.getItem('vendorName')
  const tukangName = localStorage.getItem('tukangName')
  const salesName = localStorage.getItem('salesName')
  const storeName = localStorage.getItem('storeName')
  const role = localStorage.getItem('userRole')

  const minimize = () => {
    asideRef.current?.classList.add('animating')
    setTimeout(() => {
      asideRef.current?.classList.remove('animating')
    }, 300)
  }

  return (
    <div
      id='kt_aside'
      // className={clsx('aside', classes.aside.join(' '))}
      className='aside aside-light'
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
      ref={asideRef}
    >
      {/* begin::Brand */}
      <div
        className='aside-logo d-flex justify-content-center align-items-center flex-column'
        id='kt_aside_logo'
      >
        <Link to='/home'>
          <img
            alt='Logo'
            className='h-50px logo mb-3'
            src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
          />
        </Link>

        <div className='d-flex justify-content-center align-items-center flex-column'>
          <img
            alt='Logo'
            className='h-75px logo rounded-circle mb-3'
            src={toAbsoluteUrl('/media/avatars/blank.png')}
          />

          <h6 className='text-center text-secondary-emphasis'>
            {role === 'Owner Vendor'
              ? vendorName
              : role === 'Admin Vendor'
              ? username
              : role === 'Sales'
              ? salesName
              : role === 'Admin HO' || role === 'Super User'
              ? username
              : role === 'Tukang'
              ? tukangName
              : role === 'Store CS'
              ? storeName
              : fullName}
            <br />({role}){' '}
          </h6>
        </div>
        {/* end::Logo */}

        {/* begin::Aside toggler */}
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
            onClick={minimize}
          >
            <KTSVG
              path={'/media/icons/duotune/arrows/arr080.svg'}
              className={'svg-icon-1 rotate-180'}
            />
          </div>
        )}
        {/* end::Aside toggler */}
      </div>
      {/* end::Brand */}

      {/* begin::Aside menu */}
      <div className='aside-menu flex-column-fluid'>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}
    </div>
  )
}

export {AsideDefault}
