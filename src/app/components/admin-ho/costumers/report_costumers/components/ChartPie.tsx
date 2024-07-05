/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
  totalMember: number
  memberData: any[]
}

const ChartPie: React.FC<Props> = ({className, chartHeight, memberData, totalMember}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, memberData))
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
  }, [chartRef, mode, memberData, totalMember])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-10'>
          <div ref={chartRef} className='mixed-widget-10-chart'></div>

          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-dark text-muted'>Customer</div>
            <div className='fs-1 '>{totalMember}</div>
            <div className='fs-5 text-muted mb-5'>Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, memberData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const singleOrder = memberData.filter((member: any) => member?.order?.length === 1).length
  const multiOrder = memberData.filter((member: any) => member?.order?.length > 1).length

  const series = [singleOrder, multiOrder]
  const noDataAvailable = series.every((value) => value === 0)

  return {
    series: noDataAvailable ? [1] : series, // Set series to [1] if no data available
    labels: ['ORDER SATU', 'ORDER BANYAK'],
    colors: ['#009DFF', '#22E4FF'], // Set colors to default if no data available
    // labels: noDataAvailable ? ['No Data Available'] : ['Diselidiki', 'Ditolak', 'Diselesaikan'], // Set labels to empty array if no data available
    // colors: noDataAvailable ? ['#f0f0f0'] : ['#009DFF', '#22E4FF'], // Set colors to default if no data available
    chart: {
      width: chartHeight,
      type: 'pie',
    },
    legend: {
      show: true,
      height: 20,
      position: 'left',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        top: 10,
      },
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

export {ChartPie}
