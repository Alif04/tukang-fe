/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {bottom} from '@popperjs/core'

type Props = {
  className: string
  chartComplaintData: any[]
}

const TotalComplaint: React.FC<Props> = ({className, chartComplaintData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, chartComplaintData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartComplaintData))
    if (chart) {
      chart.render()
    }

    return chart
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}} />
      </div>
    </div>
  )
}

export {TotalComplaint}

function getChartOptions(height: number, chartComplaintData: any): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const baseColor = getCSSVariableValue('--kt-primary')
  const secondaryColor = getCSSVariableValue('--kt-info')

  return {
    series: [
      {
        name: 'Masuk',
        data: chartComplaintData.map((item: any) => item?.totalComplaint ?? 0),
      },
      {
        name: 'Diterima',
        data: chartComplaintData.map((item: any) => item?.totalComplaintApprovedByHO ?? 0),
      },
      {
        name: 'Ditolak',
        data: chartComplaintData.map((item: any) => item?.totalComplaintRejectedByHO ?? 0),
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '75%',
        borderRadius: 0,
      },
    },
    legend: {
      show: true,
      position: bottom,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartComplaintData.map((item: any) => item?.period),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0)
        },
        show: true,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val + ''
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
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
