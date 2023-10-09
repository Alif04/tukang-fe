/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from '@syncfusion/ej2-react-schedule'

const ViewCalendarTukang: React.FC = () => {
  const data: object[] = [
    {
      Id: 1,
      Subject: 'Meeting - 1',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 16, 12, 30),
      IsAllDay: false,
    },
  ]

  const eventSettings = {dataSource: data}

  return (
    <section id='view-calendar'>
      {/* <ScheduleComponent
        height='650px'
        selectedDate={new Date(2023, 9, 27)}
        eventSettings={eventSettings}
        currentView='Week'
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent> */}
    </section>
  )
}

export {ViewCalendarTukang}
