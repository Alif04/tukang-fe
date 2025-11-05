import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Private} from './components/Private'
import {Group} from './components/Group'
import PeringatanService from './PeringatanService'

const chatBreadCrumbs: Array<PageLink> = [
  {
    title: 'Chat',
    path: '/chat/view-chat',
    isSeparator: false,
    isActive: false,
  },
]

const ChatPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='view-chat'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Chat</PageTitle>
              <Private />
            </>
          }
        />
        <Route
          path='peringatan-service'
          element={
            <>
              <PageTitle breadcrumbs={chatBreadCrumbs}>Peringatan Service</PageTitle>
              <PeringatanService />
            </>
          }
        />
        <Route index element={<Navigate to='/chat/view-chat' />} />
      </Route>
    </Routes>
  )
}

export default ChatPage
