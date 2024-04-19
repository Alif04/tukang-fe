// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  chartOrderData: any[]
  className: string
  chartHeight: string
  backGroundColor: string
}

const SalesReportWidget: React.FC<Props> = ({
  className,
  backGroundColor,
  chartHeight,
  chartOrderData,
}) => {
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
      className={`card ${className} theme-dark-bg-body`}
      style={{backgroundColor: backGroundColor}}
    >
      <div className='card-body d-flex flex-column p-5'>
        <div className='d-flex flex-stack flex-wrap flex-grow-1 align-items-start'>
          <div className='me-2'>
            <span className='fw-bold text-gray-800 d-block fs-3'>Order Sales Report</span>
          </div>
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

const chartOptions = (chartHeight: string, chartOrderData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  return {
    series: [
      {
        name: 'Jumlah Order',
        data: chartOrderData.map((item) => item?.totalOrder),
      },
      {
        name: 'Grand Total Value',
        data: chartOrderData.map((item) => item?.totalOrderGrandTotalPerMonth),
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
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '8px',
        colors: ['#fff'],
      },
    },
    xaxis: {
      categories: chartOrderData.map((item) => item?.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        show: false,
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
            return val + ' Order'
          },
        },
        {
          formatter: function (val) {
            return 'Rp. ' + val.toLocaleString('id')
          },
        },
      ],
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

export {SalesReportWidget}
