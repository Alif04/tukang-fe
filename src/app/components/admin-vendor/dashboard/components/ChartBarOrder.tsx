/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {bottom} from '@popperjs/core'

type Props = {
  className: string
  orderData: any[]
}

const ChartBarOrder: React.FC<Props> = ({className, orderData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, orderData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, orderData))
    if (chart) {
      chart.render()
    }

    return chart
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-1'>
        <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '235px'}} />
      </div>
    </div>
  )
}

export {ChartBarOrder}

function getChartOptions(height: number, orderData: any): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const isHour = orderData?.every(
    (item: any) => /^\d+$/.test(item.period) && orderData.length === 24
  )

  return {
    series: [
      {
        name: 'Order Selesai',
        data: orderData.map((item: any) => item.totalOrderDone),
      },
      {
        name: 'Order Masuk',
        data: orderData.map((item: any) => item.totalOrder),
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
      categories: orderData?.map((item: any) => {
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
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return typeof val === 'number' ? val.toFixed(0) : val
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
    colors: ['#009DFF', '#22E4FF'],
    grid: {
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
        breakpoint: 768,
        options: {
          chart: {
            height: '1200px',
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: '100%',
              borderRadius: 0,
            },
          },
          xaxis: {
            labels: {
              formatter: function (val: any) {
                return typeof val === 'number' ? val.toFixed(0) : val
              },
              style: {
                colors: labelColor,
                fontSize: '12px',
              },
            },
          },
        },
      },
    ],
  }
}
