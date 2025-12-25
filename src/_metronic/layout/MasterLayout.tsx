import {useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {AsideDefault} from './components/aside/AsideDefault'
import ChatPage from './components/chat/ChatPage'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider} from './core'
import {useLocation} from 'react-router-dom'
import {ThemeModeProvider} from '../partials'
import {MenuComponent} from '../assets/ts/components'

const MasterLayout = () => {
  const location = useLocation()
  const userRole = localStorage.getItem('userRole') as string
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  return (
    <PageDataProvider>
      <ThemeModeProvider>
        <div className='page d-flex flex-row flex-column-fluid'>
          <AsideDefault />
          <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
            <HeaderWrapper className='bg-primary' />

            <div
              id='kt_content'
              className='content d-flex flex-column flex-column-fluid'
              style={{marginTop: '-3.5rem'}}
            >
              <Content>
                <Outlet />
              </Content>
              {/* {(userRole === 'Admin HO' ||
                userRole === 'Store CS' ||
                userRole === 'Owner Vendor' ||
                userRole === 'Super User') && <ChatPage />} */}
            </div>
          </div>
        </div>
        <ScrollTop />
      </ThemeModeProvider>
    </PageDataProvider>
  )
}

export {MasterLayout}
