/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials'

type Props = {
  className: string
  chartHeight: string
}

const ChartPie: React.FC<Props> = ({className, chartHeight}) => {
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
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex flex-column align-items-start'>
          <h3 className='text-uppercase'>PEKERJAAN</h3>
          <div ref={chartRef} className='mixed-widget-10-chart'></div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const doneColor = getCSSVariableValue('--kt-primary')
  const progressColor = getCSSVariableValue('--kt-info')
  const pendingColor = getCSSVariableValue('--kt-danger')
  const complaintColor = getCSSVariableValue('--kt-warning')
  const Reschedule = getCSSVariableValue('--kt-danger')

  return {
    series: [44, 55, 13, 43, 55],
    chart: {
      width: chartHeight,
      type: 'pie',
    },
    labels: ['DONE', 'PROGRESS', 'PENDING', 'COMPLAINT', 'RESCHEDULE'],
    legend: {
      show: true,
      height: 20,
      position: 'bottom',
    },
    dataLabels: {
      enabled: false,
    },
    colors: [doneColor, progressColor, pendingColor, complaintColor, Reschedule],
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

export {ChartPie}
