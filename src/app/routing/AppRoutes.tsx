/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Login} from '../modules/login/Login'
import {App} from '../App'

import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
// const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const username = localStorage.getItem('username')
  const userRole = localStorage.getItem('userRole')
  const accessToken = localStorage.getItem('accessToken')

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />

          {!username || !userRole || !accessToken ? (
            <>
              <Route path='login' element={<Login />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </>
          ) : (
            <>
              <Route index element={<Navigate to='/home' />} />
              <Route path='/*' element={<PrivateRoutes />} />
              <Route path='login' element={<Navigate to='/home' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
