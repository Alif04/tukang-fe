import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
// import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'

const PrivateRoutes = () => {
  const CalendarPage = lazy(() => import('../modules/calendar/CalendarPage'))
  const OrderPage = lazy(() => import('../modules/order/OrderPage'))
  const ComplaintPage = lazy(() => import('../modules/complaint/ComplaintPage'))
  const WarrantyPage = lazy(() => import('../modules/warranty/WarrantyPage'))
  const ReportPage = lazy(() => import('../modules/reports/ReportPage'))
  const CostumersPage = lazy(() => import('../modules/customers/CostumersPage'))
  const CSIpage = lazy(() => import('../modules/csi/CSIpage'))
  const VendorPage = lazy(() => import('../modules/vendor/VendorPage'))
  const WorkOrderPage = lazy(() => import('../modules/work-order/WorkOrderPage'))
  const QuotationPage = lazy(() => import('../modules/quotation/QuotationPage'))
  const PaymentPage = lazy(() => import('../modules/payment/PaymentPage'))
  const SalesPage = lazy(() => import('../modules/sales/SalesPage'))
  const InvoicePage = lazy(() => import('../modules/invoice/InvoicePage'))
  const RefundPage = lazy(() => import('../modules/refund/RefundPage'))
  const TukangPage = lazy(() => import('../modules/tukang/TukangPage'))
  const MaterialPage = lazy(() => import('../modules/material/MaterialPage'))

  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Home after success Login */}
        {/* <Route path='login' element={<Navigate to='/home' />} /> */}

        {/* Pages */}
        <Route path='home' element={<DashboardWrapper />} />

        {/* <Route path='builder' element={<BuilderPageWrapper />} /> */}
        <Route path='menu-test' element={<MenuTestPage />} />

        {/* Lazy Modules */}

        <Route
          path='calendar/*'
          element={
            <SuspensedView>
              <CalendarPage />
            </SuspensedView>
          }
        />

        <Route
          path='order/*'
          element={
            <SuspensedView>
              <OrderPage />
            </SuspensedView>
          }
        />

        <Route
          path='costumers/*'
          element={
            <SuspensedView>
              <CostumersPage />
            </SuspensedView>
          }
        />

        <Route
          path='work-order/*'
          element={
            <SuspensedView>
              <WorkOrderPage />
            </SuspensedView>
          }
        />

        <Route
          path='tukang/*'
          element={
            <SuspensedView>
              <TukangPage />
            </SuspensedView>
          }
        />

        <Route
          path='complaint/*'
          element={
            <SuspensedView>
              <ComplaintPage />
            </SuspensedView>
          }
        />

        <Route
          path='warranty/*'
          element={
            <SuspensedView>
              <WarrantyPage />
            </SuspensedView>
          }
        />

        <Route
          path='material/*'
          element={
            <SuspensedView>
              <MaterialPage />
            </SuspensedView>
          }
        />

        <Route
          path='reports/*'
          element={
            <SuspensedView>
              <ReportPage />
            </SuspensedView>
          }
        />

        <Route
          path='csi/*'
          element={
            <SuspensedView>
              <CSIpage />
            </SuspensedView>
          }
        />

        <Route
          path='vendor/*'
          element={
            <SuspensedView>
              <VendorPage />
            </SuspensedView>
          }
        />

        <Route
          path='quotation/*'
          element={
            <SuspensedView>
              <QuotationPage />
            </SuspensedView>
          }
        />

        <Route
          path='payment/*'
          element={
            <SuspensedView>
              <PaymentPage />
            </SuspensedView>
          }
        />

        <Route
          path='sales/*'
          element={
            <SuspensedView>
              <SalesPage />
            </SuspensedView>
          }
        />

        <Route
          path='invoice/*'
          element={
            <SuspensedView>
              <InvoicePage />
            </SuspensedView>
          }
        />

        <Route
          path='refund/*'
          element={
            <SuspensedView>
              <RefundPage />
            </SuspensedView>
          }
        />

        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
