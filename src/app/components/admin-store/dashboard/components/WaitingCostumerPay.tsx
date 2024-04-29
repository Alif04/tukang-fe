/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  orderData: any[]
}

const getStatusCount = (orderData: any[]): number => {
  return (
    orderData?.filter((order) => order.receipt_number === null && order.payment_type !== 'gratis')
      .length ?? 0
  )
}

const WaitingCostumerPay: React.FC<Props> = ({className, chartColor, chartHeight, orderData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight, orderData))
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
  }, [chartRef, mode, orderData])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-5'>
          <div className='d-flex flex-column gap-5'>
            <div className='fs-5 text-dark text-muted'>Menunggu Bayar</div>
            <div className='fs-1 d-block m-auto'>{getStatusCount(orderData)}</div>
            <div className='fs-5 text-muted'>Menunggu pembayaran Customer</div>
          </div>

          <div ref={chartRef} className='mixed-widget-4-chart'></div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string, orderData: any): ApexOptions => {
  const unpaidCount = getStatusCount(orderData)
  const totalOrders = orderData?.length

  const percentageUnpaidOrder = totalOrders > 0 ? Math.round((unpaidCount / totalOrders) * 100) : 0

  const lightColor = getCSSVariableValue('--kt-' + chartColor + '-light')
  const labelColor = getCSSVariableValue('--kt-gray-700')

  return {
    series: [percentageUnpaidOrder],
    chart: {
      fontFamily: 'inherit',
      width: '100px',
      height: chartHeight,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '65%',
        },
        dataLabels: {
          name: {
            show: false,
            fontWeight: '700',
          },
          value: {
            color: labelColor,
            fontSize: '20px',
            fontWeight: '700',
            offsetY: 8,
            show: true,
            formatter: function (val) {
              return val + '%'
            },
          },
        },
        track: {
          background: lightColor,
          strokeWidth: '100%',
        },
      },
    },
    colors: ['#58DFA5'],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  }
}

export {WaitingCostumerPay}
