// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  chartOrderData: any[]
  chartHeight: string
}

const OrderValueWidget: React.FC<Props> = ({chartHeight, chartOrderData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, chartOrderData))
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
  }, [chartRef, mode, chartOrderData])

  return (
    <div
      ref={chartRef}
      className='mixed-widget-13-chart'
      style={{height: chartHeight, minHeight: chartHeight}}
    ></div>
  )
}

const chartOptions = (chartHeight: string, chartOrderData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const isHour = chartOrderData?.every(
    (item) => /^\d+$/.test(item.period) && chartOrderData.length === 24
  )

  return {
    series: [
      {
        name: 'Grand Total Value',
        data: chartOrderData?.map((item) => item?.totalOrderGrandTotal),
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '8px',
        colors: ['#fff'],
      },
    },
    xaxis: {
      categories: chartOrderData?.map((item) => {
        if (/^\d+$/.test(item.period)) {
          return isHour ? `${item.period}:00` : `${item.period}`
        } else {
          return `${item.period}`
        }
      }),
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0)
        },
        show: true,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: [
        {
          formatter: function (val) {
            return 'Rp. ' + val.toLocaleString('id')
          },
        },
      ],
    },
    colors: ['#22E4FF'],
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
        breakpoint: 1400,
        options: {
          chart: {
            fontFamily: 'inherit',
            type: 'bar',
            height: '250px',
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: true,
            height: 20,
            position: 'bottom',
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '8px',
              colors: ['#fff'],
            },
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            fontFamily: 'inherit',
            type: 'bar',
            height: '300px',
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: true,
            height: 20,
            position: 'left',
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '8px',
              colors: ['#fff'],
            },
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            fontFamily: 'inherit',
            type: 'bar',
            height: chartHeight,
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: true,
            height: 20,
            position: 'bottom',
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '8px',
              colors: ['#fff'],
            },
          },
        },
      },
    ],
  }
}

export {OrderValueWidget}
