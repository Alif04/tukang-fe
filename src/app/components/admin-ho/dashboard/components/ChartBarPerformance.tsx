/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {bottom} from '@popperjs/core'

type Props = {
  className: string
}

const ChartBarPerformance: React.FC<Props> = ({className}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height))
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

export {ChartBarPerformance}

function getChartOptions(height: number): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const baseColor = getCSSVariableValue('--kt-primary')
  const secondaryColor = getCSSVariableValue('--kt-info')
  const thirdColor = getCSSVariableValue('--kt-success')
  const fourthColor = getCSSVariableValue('--kt-danger')

  return {
    series: [
      {
        name: 'HO',
        data: [44, 55, 57, 56, 61, 58],
      },
      {
        name: 'Fatmawati',
        data: [76, 85, 101, 98, 87, 105],
      },
      {
        name: 'Bekasi',
        data: [56, 35, 11, 48, 84, 25],
      },
      {
        name: 'Cianjur',
        data: [66, 45, 31, 58, 94, 55],
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
    colors: [baseColor, secondaryColor, thirdColor, fourthColor],
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
