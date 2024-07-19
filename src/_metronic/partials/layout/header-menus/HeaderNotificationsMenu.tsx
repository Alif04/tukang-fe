/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl, defaultAlerts, defaultLogs} from '../../../helpers'

const HeaderNotificationsMenu: FC = () => (
  <div
    className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
    data-kt-menu='true'
  >
    <div
      className='d-flex flex-column bgi-no-repeat rounded-top'
      style={{backgroundImage: `url('${toAbsoluteUrl('/media/misc/pattern-1.jpg')}')`}}
    >
      <h3 className='text-white fw-bold px-9 mt-10 mb-6'>
        Notitifikasi <span className='fs-8 opacity-75 ps-3'>24 reports</span>
      </h3>
    </div>

    <div className='d-flex flex-column px-9'>
      <div className='pt-10 pb-0'></div>
    </div>
  </div>
)

export {HeaderNotificationsMenu}
