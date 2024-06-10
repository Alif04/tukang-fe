/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewCostumerStore} from '../../../components'
import {ViewCostumerHO} from '../../../components'

const ViewCostumer: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <ViewCostumerStore className='' />
        </>
      ) : userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <ViewCostumerHO className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewCostumer}
