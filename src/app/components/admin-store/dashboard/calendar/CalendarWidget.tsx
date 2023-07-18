import React, {useState} from 'react'
import Calendar from 'react-calendar'
import './CalendarWidget.css'
import 'react-calendar/dist/Calendar.css'

type Props = {
  className: string
}

const CalendarWidget: React.FC<Props> = ({className}) => {
  const [date] = useState(new Date())

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <Calendar
          defaultValue={date}
          view={'month'}
          prevLabel={
            <i className='bi bi-chevron-left' style={{fontSize: '25px', color: '#0f4cff'}}></i>
          }
          nextLabel={
            <i className='bi bi-chevron-right' style={{fontSize: '25px', color: '#0f4cff'}}></i>
          }
        />
      </div>
    </div>
  )
}

export {CalendarWidget}
