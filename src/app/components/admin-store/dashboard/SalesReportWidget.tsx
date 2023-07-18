// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
  backGroundColor: string
}

const SalesReportWidget: React.FC<Props> = ({className, backGroundColor, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode])

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

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{backgroundColor: backGroundColor}}
    >
      <div className='card-body d-flex flex-column p-5'>
        <div className='d-flex flex-stack flex-wrap flex-grow-1 align-items-start'>
          <div className='me-2'>
            <span className='fw-bold text-gray-800 d-block fs-3'>Order Sales Report</span>
          </div>

          <div className={`fw-bold fs-3`}>$15,300</div>
        </div>

        <div
          ref={chartRef}
          className='mixed-widget-13-chart'
          style={{height: chartHeight, minHeight: chartHeight}}
        ></div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--kt-gray-800')
  const strokeColor = getCSSVariableValue('--kt-gray-300') as string

  return {
    series: [
      {
        name: 'Net Profit',
        data: [40, 50, 25, 35, 45, 20, 30],
      },
    ],
    grid: {
      show: false,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.7,
        opacityTo: 0,
        stops: [20, 120, 120, 120],
      },
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['#605BDA'],
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fr', 'Sat', 'Sun'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: strokeColor,
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
      min: 0,
      max: 60,
      labels: {
        show: false,
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
          return '$' + val + ' thousands'
        },
      },
    },
    colors: ['#605BDA'],
    markers: {
      colors: [labelColor],
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  }
}

export {SalesReportWidget}
