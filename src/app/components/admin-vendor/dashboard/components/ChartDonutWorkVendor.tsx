/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
}

const ChartDonutWorkVendor: React.FC<Props> = ({className, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight))
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
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-success'>Work</h1>

          <div className='d-flex justify-content-center'>
            <div ref={chartRef} className='mixed-widget-10-chart'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const processColor = getCSSVariableValue('--kt-info')
  const pendingColor = getCSSVariableValue('--kt-primary')
  const cancelColor = getCSSVariableValue('--kt-dark')
  const ReworkColor = getCSSVariableValue('--kt-success')
  const refundColor = getCSSVariableValue('--kt-danger')

  return {
    series: [44, 55, 13, 30, 2],
    chart: {
      width: 500,
      height: chartHeight,
      type: 'donut',
    },
    labels: ['On Progress', 'Done', 'Reschedule', 'Rework', 'Refund'],
    legend: {
      show: true,
      height: 20,
      position: 'bottom',
    },
    dataLabels: {
      enabled: false,
    },
    colors: [processColor, pendingColor, cancelColor, ReworkColor, refundColor],
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

export {ChartDonutWorkVendor}
