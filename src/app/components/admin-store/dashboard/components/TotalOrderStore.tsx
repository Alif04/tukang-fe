/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
  chartOrder: any
}

const sumTotal = (data: any, key: string) =>
  data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

const TotalOrderStore: React.FC<Props> = ({className, chartHeight, chartOrder}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, chartOrder))
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
  }, [chartRef, mode, chartOrder])

  const totalOrders = sumTotal(chartOrder, 'totalOrder')

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-4'>
          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-dark text-muted'>Jumlah Order</div>
            <div className='fs-1 d-block m-auto'>{totalOrders}</div>
          </div>

          <div ref={chartRef} className='mixed-widget-10-chart'></div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, chartOrder: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const completedOrder = sumTotal(chartOrder, 'totalOrderDone')
  const canceledOrder = sumTotal(chartOrder, 'totalCancel')
  const refundOrder = sumTotal(chartOrder, 'totalRefund')

  const series = [completedOrder, canceledOrder, refundOrder]
  const noDataAvailable = series.every((value) => value === 0)

  return {
    series: noDataAvailable ? [1] : series, // Set series to [1] if no data available
    labels: noDataAvailable ? ['No Data Available'] : ['Complete', 'Cancel', 'Refund'], // Set labels to empty array if no data available
    colors: noDataAvailable ? ['#f0f0f0'] : ['#1D7710', '#D8001B', '#F59B22'], // Set colors to default if no data available
    chart: {
      width: chartHeight,
      type: 'pie',
    },
    legend: {
      show: true,
      height: 35,
      offsetY: 0,
      position: 'bottom',
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
    responsive: [
      {
        breakpoint: 1400,
        options: {
          chart: {
            width: '150px',
            type: 'pie',
          },
          legend: {
            show: false,
            height: 35,
            offsetY: 0,
            position: 'bottom',
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: '220px',
            type: 'pie',
          },
          legend: {
            show: true,
            height: 35,
            offsetY: 0,
            position: 'bottom',
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            width: '220px',
            type: 'pie',
          },
          legend: {
            show: true,
            height: 35,
            offsetY: 0,
            position: 'bottom',
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
    ],
  }
}

export {TotalOrderStore}
