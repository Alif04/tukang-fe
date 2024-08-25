/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useRef, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useLayout} from '../../core'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'
import axiosInstance from '../../core/axiosInterceptor'

interface User {
  user_id: number | null
  username: string
  full_name: string
  roles: string
}

const AsideDefault: FC = () => {
  const {config, classes} = useLayout()
  const asideRef = useRef<HTMLDivElement | null>(null)
  const {aside} = config

  const apiUrl = process.env.REACT_APP_API_URL
  const userId = localStorage.getItem('user_id')

  const [user, setUser] = useState<User>({
    user_id: null,
    username: '',
    full_name: '',
    roles: '',
  })

  const getUser = async () => {
    try {
      await axiosInstance.get(`${apiUrl}/auth/find-user/${userId}`).then((response) => {
        const data = response.data.data
        const role = data?.roles?.name

        switch (role) {
          case 'Sales':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: data?.sales[0]?.full_name ?? '',
              roles: role,
            })
            break
          case 'Store Staff':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: data?.employee?.full_name ?? '',
              roles: role,
            })
            break
          case 'Store CS':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: data?.store[0]?.store_name ?? '',
              roles: role,
            })
            break
          case 'Super User':
          case 'Admin HO':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: '',
              roles: role,
            })
            break
          case 'Owner Vendor':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: data?.pic_vendor[0]?.vendor?.company_name ?? '',
              roles: role,
            })
            break
          case 'Admin Vendor':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: data?.pic_vendor[0]?.pic_name ?? '',
              roles: role,
            })
            break
          case 'Tukang':
            setUser({
              user_id: data.id,
              username: data?.username ?? '',
              full_name: data?.tukang[0]?.full_name ?? '',
              roles: role,
            })
            break
          default:
            console.log('user not found!:')
        }
      })
    } catch (error: any) {
      console.log('error when fetching data', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

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
            {['Super User', 'Admin HO'].includes(user.roles) ? user.username : user.full_name}
            <br />({user.roles}){' '}
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
