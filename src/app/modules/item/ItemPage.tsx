import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewItem} from './components/ViewItem'
import {NewItem} from './components/NewItem'
import {UpdateItem} from './components/UpdateItem'
import {DetailItem} from './components/DetailItem'

const itemBreadCrumbs: Array<PageLink> = [
  {
    title: 'Item',
    path: '/item/view-item',
    isSeparator: false,
    isActive: false,
  },
]

const ItemPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-item'
        element={
          <>
            <PageTitle breadcrumbs={itemBreadCrumbs}>ITEM LIST</PageTitle>
            <ViewItem />
          </>
        }
      />

      <Route
        path='new-item'
        element={
          <>
            <PageTitle breadcrumbs={itemBreadCrumbs}>NEW ITEM FORM</PageTitle>
            <NewItem />
          </>
        }
      />

      <Route
        path='update-item/:id'
        element={
          <>
            <PageTitle breadcrumbs={itemBreadCrumbs}>UPDATE ITEM</PageTitle>
            <UpdateItem />
          </>
        }
      />

      <Route
        path='detail-item/:id'
        element={
          <>
            <PageTitle breadcrumbs={itemBreadCrumbs}>DETAIL ITEM</PageTitle>
            <DetailItem />
          </>
        }
      />

      <Route index element={<Navigate to='/item/view-item' />} />
    </Routes>
  )
}

export default ItemPage
