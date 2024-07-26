/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {bottom} from '@popperjs/core'

type Props = {
  className: string
  chartWorkOrder: any[]
}

const ChartLine2: React.FC<Props> = ({className, chartWorkOrder}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartWorkOrder))
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
  }, [chartRef, mode, chartWorkOrder])

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <div ref={chartRef} id='kt_charts_widget_4_chart' style={{height: '350px'}}></div>
      </div>
    </div>
  )
}

export {ChartLine2}

function getChartOptions(height: number, chartWorkOrder: any): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const baseColor = getCSSVariableValue('--kt-primary')
  const baseLightColor = getCSSVariableValue('--kt-primary-light')
  const secondaryColor = getCSSVariableValue('--kt-info')
  const secondaryLightColor = getCSSVariableValue('--kt-info-light')
  const isHour = chartWorkOrder?.every(
    (item: any) => /^\d+$/.test(item.period) && chartWorkOrder.length === 24
  )

  return {
    series: [
      {
        name: 'Permintaan pengerjaan',
        data: chartWorkOrder.map((item: any) => item?.totalWaitingWork),
      },
      {
        name: 'Pengerjaan dimulai',
        data: chartWorkOrder.map((item: any) => item?.totalWorkStart),
      },
      {
        name: 'Pengerjaan selesai',
        data: chartWorkOrder.map((item: any) => item?.totalOrderDone),
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: 350,
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
      categories: chartWorkOrder?.map((item: any) => {
        if (/^\d+$/.test(item.period)) {
          return isHour ? `${item.period}:00` : `${item.period}`
        } else {
          return `${item.period}`
        }
      }),
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
      crosshairs: {
        position: 'front',
        stroke: {
          color: labelColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0)
        },
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
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
          return val + ' Order'
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
    markers: {
      colors: [baseLightColor, secondaryLightColor],
      strokeColors: [baseLightColor, secondaryLightColor],
      strokeWidth: 3,
    },
  }
}
