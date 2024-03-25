/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartHeight: string
  complaintData: any[]
}

const ChartDonut: React.FC<Props> = ({className, chartHeight, complaintData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, complaintData))
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
  }, [chartRef, mode, complaintData])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-danger'>Complaint</h1>

          <div className='d-flex justify-content-center'>
            <div ref={chartRef} className='mixed-widget-10-chart'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, complaintData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const investigated = complaintData.filter(
    (complaint: any) => complaint?.status?.category === 'INVESTIGATED'
  ).length

  const rejected = complaintData.filter(
    (complaint: any) => complaint?.status?.category === 'REJECTEDBYVENDOR'
  ).length

  const solved = complaintData.filter(
    (complaint: any) => complaint?.status?.category === 'DONE'
  ).length

  const series = [investigated, rejected, solved]
  const noDataAvailable = series.every((value) => value === 0)

  return {
    series: noDataAvailable ? [1] : series, // Set series to [1] if no data available
    labels: ['Diselidiki', 'Ditolak', 'Diselesaikan'],
    colors: ['#009DFF', '#22E4FF', '#3BFFD0'], // Set colors to default if no data available
    // labels: noDataAvailable ? ['No Data Available'] : ['Diselidiki', 'Ditolak', 'Diselesaikan'], // Set labels to empty array if no data available
    // colors: noDataAvailable ? ['#f0f0f0'] : ['#009DFF', '#22E4FF', '#3BFFD0'], // Set colors to default if no data available
    chart: {
      width: 500,
      height: chartHeight,
      type: 'donut',
    },
    legend: {
      show: true,
      height: 20,
      position: 'bottom',
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

export {ChartDonut}
