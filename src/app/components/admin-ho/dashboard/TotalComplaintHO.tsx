/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
}

const TotalComplaintHO: React.FC<Props> = ({className, chartHeight}) => {
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
        <div className='d-flex align-items-center'>
          <div ref={chartRef} className='mixed-widget-10-chart'></div>

          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-dark text-muted text-center'>COMPLAINT</div>
            <div className='fs-1 d-block m-auto'>35</div>
            <div className='fs-5 text-muted text-center'>Complaint bulan ini</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const reworkColor = getCSSVariableValue('--kt-info')
  const refundColor = getCSSVariableValue('--kt-danger')
  const rescheduleColor = getCSSVariableValue('--kt-warning')
  const investigateColor = getCSSVariableValue('--kt-success')
  const doneColor = getCSSVariableValue('--kt-secondary')

  return {
    series: [44, 55, 13, 34, 54],
    chart: {
      width: chartHeight,
      type: 'pie',
    },
    labels: ['REWORK', 'REFUND', 'RESCHEDULE', 'INVESTIGATE', 'DONE'],
    legend: {
      show: true,
      height: 20,
      position: 'left',
    },
    dataLabels: {
      enabled: false,
    },
    colors: [reworkColor, refundColor, rescheduleColor, investigateColor, doneColor],
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
            height: 20,
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
            width: '280px',
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
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            width: '240px',
            type: 'pie',
          },
          legend: {
            show: true,
            height: 20,
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

export {TotalComplaintHO}
