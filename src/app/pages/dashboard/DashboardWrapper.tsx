/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  CalendarWidget,
  MixedWidget1,
  MixedWidget2,
  MixedWidget3,
  MixedWidget4,
  MixedWidget5,
  MixedWidget6,
  MixedWidget7,
  MixedWidget8,
  MixedWidget9,
  MixedWidget10,
  MixedWidget11,
  MixedWidget13,
  MixedWidget14,
  MixedWidget15,
  TotalOrder,
  TotalComplaint,
  TotalFinishedJob,
  TotalReschedule,
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget5,
  ListsWidget6,
  TransactionWidget,
  TopSalesWidget,
  RecentEventWidget,
  TablesWidget5,
  TablesWidget10,
} from '../../../_metronic/partials/widgets'

const DashboardPage: FC = () => (
  <>
    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <MixedWidget13
          className='card-xl-stretch mb-xl-8'
          backGroundColor='white'
          chartHeight='250px'
        />
      </div>

      <div className='col-xxl-4'>
        <TotalOrder className='card-xxl-stretch-50 mb-5 mb-xl-8' chartHeight='200px' />
        <TotalComplaint
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='danger'
          chartHeight='175px'
        />
      </div>

      <div className='col-xxl-4'>
        <TotalFinishedJob
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='success'
          chartHeight='150px'
        />
        <TotalReschedule
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='success'
          chartHeight='175px'
        />
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <TransactionWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-3'>
        <TopSalesWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-5'>
        <RecentEventWidget className='card-xl-stretch mb-5 mb-xl-8' items={5} />
        {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-7'>
        <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
      </div>

      <div className='col-xxl-5'>
        <CalendarWidget className='card-xxl-stretch mb-xl-3' />
      </div>
    </div>
    {/* end::Row */}
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
