/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials'

type Props = {
  className: string
  chartHeight: string
  workOrderData: any[]
}

const TotalWork: React.FC<Props> = ({className, chartHeight, workOrderData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, workOrderData))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, workOrderData])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center'>
          <div ref={chartRef} className='mixed-widget-10-chart'></div>

          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-dark text-muted text-center'>Work</div>
            <div className='fs-1 d-block m-auto'>{workOrderData.length}</div>
            <div className='fs-5 text-muted'>Work bulan ini</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, workOrderData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const workReq = workOrderData.filter(
    (workOrder: any) => workOrder?.work_orders?.work_order_status[0]?.status?.category === 'WORKREQ'
  ).length

  const workInProgress = workOrderData.filter(
    (workOrder: any) => workOrder?.work_orders?.work_order_status[0]?.status?.category === 'WIP'
  ).length

  const workDone = workOrderData.filter(
    (workOrder: any) =>
      workOrder?.work_orders?.work_order_status[0]?.status?.category === 'WORKDONE'
  ).length

  const series = [workReq, workInProgress, workDone]
  const noDataAvailable = series.every((value) => value === 0)

  return {
    series: noDataAvailable ? [1] : series, // Set series to [1] if no data available
    labels: ['REQUEST PENGERJAAN', 'SEDANG DIKERJAKAN', 'PEKERJAAN SELESAI'],
    colors: ['#1D7710', '#F59B22', '#D8001B'],
    // labels: noDataAvailable ? ['No Data Available'] : ['W.Req', 'WIP', 'DONE'], // Set labels to empty array if no data available
    // colors: noDataAvailable ? ['#f0f0f0'] : ['#1D7710', '#F59B22', '#D8001B'], // Set colors to default if no data available
    chart: {
      width: chartHeight,
      type: 'pie',
    },
    legend: {
      show: true,
      height: 20,
      position: 'left',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}

export {TotalWork}
