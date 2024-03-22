/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials'

type Props = {
  className: string
  chartHeight: string
  orderData: any[]
}

const TotalOrder: React.FC<Props> = ({className, chartHeight, orderData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, orderData))
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
  }, [chartRef, mode, orderData])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center'>
          <div ref={chartRef} className='mixed-widget-10-chart'></div>

          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-dark text-muted text-center'>Order</div>
            <div className='fs-1 d-block m-auto'>{orderData.length}</div>
            <div className='fs-5 text-muted'>Order bulan ini</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, orderData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const orderIn = orderData.length

  const paidOrder = orderData.filter((order: any) =>
    order?.work_orders?.work_order_status.length > 0
      ? order?.work_orders?.work_order_status[0]?.status?.category === 'PAID'
      : order?.status?.category === 'PAID'
  ).length

  const canceledOrder = orderData.filter((order: any) =>
    order?.work_orders?.work_order_status.length > 0
      ? order?.work_orders?.work_order_status[0]?.status?.category === 'CANCEL'
      : order?.status?.category === 'CANCEL'
  ).length

  const series = [orderIn, paidOrder, canceledOrder]
  const noDataAvailable = series.every((value) => value === 0)

  return {
    series: noDataAvailable ? [1] : series, // Set series to [1] if no data available
    labels: ['ORDER MASUK', 'ORDER DIBAYAR', 'ORDER BATAL'],
    colors: ['#1D7710', '#F59B22', '#D8001B'],
    // labels: noDataAvailable ? ['No Data Available'] : ['O.IN', 'PAID', 'CANCEL'], // Set labels to empty array if no data available
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

export {TotalOrder}
