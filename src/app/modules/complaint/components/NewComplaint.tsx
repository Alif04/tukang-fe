import React, {FC} from 'react'

import {NewComplaintStore} from '../../../components'

const NewComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' ? (
        <>
          <NewComplaintStore />
        </>
      ) : userRole === 'Store Staff' ? (
        <>
          <NewComplaintStore />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewComplaint}
