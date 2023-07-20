import React, {useState} from 'react'

import './DateRange.css'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const DateRange: React.FC<Props> = ({className}) => {
  return (
    <>
      <RangePicker className='date-range' />
    </>
  )
}

export {DateRange}
