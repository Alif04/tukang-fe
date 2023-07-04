import React, {useState} from 'react'
import Calendar from 'react-calendar'
import './CalendarWidget.css'
import 'react-calendar/dist/Calendar.css'

type Props = {
  className: string
}

const CalendarWidget: React.FC<Props> = ({className}) => {
  const [date, setDate] = useState(new Date())

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <Calendar defaultValue={date} view={'month'} />
      </div>
    </div>
  )
}

export {CalendarWidget}
