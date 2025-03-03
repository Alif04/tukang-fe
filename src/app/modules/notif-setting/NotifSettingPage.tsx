import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {NotifSetting} from './components/NotifSetting'
import { HeaderWrapper } from '../../../_metronic/layout/components/header/HeaderWrapper'

const notifSettingBreadCrumbs: Array<PageLink> = [
  {
    title: 'Notif Setting',
    path: '/notif-setting/view-setting',
    isSeparator: false,
    isActive: false,
  },
]

const NotifSettingPage:React.FC = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='view-setting'
          element={
            <>
              <HeaderWrapper className='bg-header-ho' />
              <PageTitle breadcrumbs={notifSettingBreadCrumbs}>Setting</PageTitle>
              <NotifSetting />
            </>
          }
        />
        <Route index element={<Navigate to='/notif-setting/view-setting' />} />
      </Route>
    </Routes>
  )
}

export default NotifSettingPage
