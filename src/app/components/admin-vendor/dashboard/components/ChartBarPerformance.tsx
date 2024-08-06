/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {bottom} from '@popperjs/core'

type Props = {
  className: string
  tukangData: any[]
}

const ChartBarPerformance: React.FC<Props> = ({className, tukangData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, tukangData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, tukangData))
    if (chart) {
      chart.render()
    }

    return chart
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1' style={{color: '#04792A'}}>
            Performance Tukang
          </h1>

          <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}}></div>
        </div>
      </div>
    </div>
  )
}

export {ChartBarPerformance}

function getChartOptions(height: number, tukangData: any): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')

  return {
    series: [
      {
        name: 'Total Invoice',
        data: tukangData.map((item: any) => item.totalInvoices),
      },
      {
        name: 'Total Quotation',
        data: tukangData.map((item: any) => item.totalQuotations),
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
        columnWidth: '25%',
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
      categories: tukangData.map((item: any) => item.tukang.full_name),
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
          return `Rp. ${val.toLocaleString('id')}`
        },
      },
    },
    colors: ['#B8741A', '#70B503', '#007EB4', '#0300BF'],
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
