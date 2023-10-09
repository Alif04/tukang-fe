import React, {FC} from 'react'

import {NewComplaintStore} from '../../../components'
import {NewComplaintHO} from '../../../components'

const NewComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <NewComplaintStore />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <NewComplaintHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewComplaint}
