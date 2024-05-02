/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
  chartComplaint: any[]
}

const ChartDonut: React.FC<Props> = ({className, chartHeight, chartComplaint}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, chartComplaint))
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
  }, [chartRef, mode, chartComplaint])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-danger'>Komplain</h1>

          <div className='d-flex justify-content-center'>
            <div ref={chartRef} className='mixed-widget-10-chart'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, chartComplaint: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const processColor = getCSSVariableValue('--kt-primary')
  const pendingColor = getCSSVariableValue('--kt-gray-800')
  const cancelColor = getCSSVariableValue('--kt-info')

  const investigated = chartComplaint.map((item: any) => item?.totalOrder)
  const totalInvestigated = investigated.reduce((acc: any, curr: any) => acc + curr, 0)

  const rejected = chartComplaint.map((item: any) => item?.totalCancelComplaint)
  const totalRejected = rejected.reduce((acc: any, curr: any) => acc + curr, 0)

  const done = chartComplaint.map((item: any) => item?.totalReworkEnd)
  const totalDone = done.reduce((acc: any, curr: any) => acc + curr, 0)

  return {
    series: [totalInvestigated, totalRejected, totalDone],
    chart: {
      width: 500,
      height: chartHeight,
      type: 'donut',
    },
    labels: ['Diterima', 'Diselidiki', 'Ditolak'],
    legend: {
      show: true,
      height: 20,
      position: 'bottom',
    },
    dataLabels: {
      enabled: false,
    },
    colors: [processColor, pendingColor, cancelColor],
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

export {ChartDonut}
