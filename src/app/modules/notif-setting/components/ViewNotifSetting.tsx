/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {  useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css'
import {TemplateChat} from '../chat/TemplateChat'
import {OfficeHours} from '../template/OfficeHours'
import {ChatConfig} from '../chat/ChatConfig'

const ViewNotifSetting: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Office Hours')
  const tabs = ['Office Hours', 'Template chat', 'Chat Konfigurasi']

  return (
    <>
      {/* Tab Navigation */}
      <div className="d-flex border-bottom">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`flex-grow-1 text-center p-3 border border-secondary border-opacity-50 ${
              selectedTab === tab
                ? 'bg-white text-primary fw-bold border-top border-primary'
                : 'bg-light text-muted'
            }`}
            style={{ cursor: 'pointer', borderStyle: 'dashed' }}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'Office Hours' && <OfficeHours/>}
        {selectedTab === 'Template chat' &&  <TemplateChat />}
        {selectedTab === 'Chat Konfigurasi' && <ChatConfig />}
      </div>
    </>
  )
}

export { ViewNotifSetting }
