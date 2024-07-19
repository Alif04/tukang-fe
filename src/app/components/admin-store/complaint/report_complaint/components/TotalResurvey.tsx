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

const TotalResurvey: React.FC<Props> = ({className, chartComplaintData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

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

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, chartComplaintData])

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}}></div>
      </div>
    </div>
  )
}

export {TotalResurvey}

function getChartOptions(height: number, chartComplaintData: any): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const baseColor = getCSSVariableValue('--kt-primary')
  const baseLightColor = getCSSVariableValue('--kt-primary-light')
  const secondaryColor = getCSSVariableValue('--kt-info')
  const secondaryLightColor = getCSSVariableValue('--kt-info-light')

  return {
    series: [
      {
        name: 'Survei Ulang',
        data: chartComplaintData?.map((item: any) => item?.totalResurvey ?? 0),
      },
      {
        name: 'Survei Ulang Selesai',
        data: chartComplaintData?.map((item: any) => item?.totalResurveyDone ?? 0),
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
    plotOptions: {},
    legend: {
      show: true,
      position: bottom,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0.4,
    },
    stroke: {
      curve: 'straight',
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
        show: true,
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
