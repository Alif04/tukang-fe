/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {bottom} from '@popperjs/core'

type Props = {
  className: string
  chartOrderData: any[]
}

const ChartBar: React.FC<Props> = ({className, chartOrderData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, chartOrderData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartOrderData))
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

export {ChartBar}

function getChartOptions(height: number, chartOrderData: any): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const baseColor = getCSSVariableValue('--kt-primary')
  const secondaryColor = getCSSVariableValue('--kt-info')
  const isHour = chartOrderData?.every(
    (item: any) => /^\d+$/.test(item.period) && chartOrderData.length === 24
  )

  return {
    series: [
      {
        name: 'Masuk',
        data: chartOrderData.map((item: any) => item?.totalOrder),
      },
      {
        name: 'Quotation sudah dibayar customer (Menunggu Perintah Kerja)',
        data: chartOrderData.map((item: any) => item?.totalPaidQuotation),
      },
      {
        name: 'Dibatalkan',
        data: chartOrderData.map((item: any) => item?.totalCancel),
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
      categories: chartOrderData?.map((item: any) => {
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
