/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../../../_metronic/partials'

type Props = {
  className: string
  chartHeight: string
  complaintData: any[]
}

const TotalComplaint: React.FC<Props> = ({className, chartHeight, complaintData}) => {
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
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center'>
          <div ref={chartRef} className='mixed-widget-10-chart'></div>

          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-dark text-muted text-center'>COMPLAINT</div>
            <div className='fs-1 d-block m-auto'>{complaintData.length}</div>
            <div className='fs-5 text-muted text-center'>Complaint bulan ini</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartHeight: string, complaintData: any): ApexOptions => {
  const borderColor = getCSSVariableValue('--kt-gray-200')

  const reworkComplaint = complaintData.filter(
    (complaintData: any) => complaintData?.complaint?.status?.category === 'REWORK'
  ).length

  const refundComplaint = complaintData.filter(
    (complaintData: any) => complaintData?.complaint?.status?.category === 'REFUND'
  ).length

  const rescheduleComplaint = complaintData.filter(
    (complaintData: any) => complaintData?.complaint?.status?.category === 'RESCHEDULE'
  ).length

  const investigateComplaint = complaintData.filter(
    (complaintData: any) => complaintData?.complaint?.status?.category === 'INVESTIGATED'
  ).length

  const complaintDone = complaintData.filter(
    (complaintData: any) => complaintData?.complaint?.status?.category === 'DONE'
  ).length

  const series = [
    reworkComplaint,
    refundComplaint,
    rescheduleComplaint,
    investigateComplaint,
    complaintDone,
  ]
  const noDataAvailable = series.every((value) => value === 0)

  return {
    series: noDataAvailable ? [1] : series, // Set series to [1] if no data available
    labels: ['PENGERJAAN ULANG', 'REFUND', 'RESCHEDULE', 'DISELIDIKI', 'SELESAI'],
    colors: ['#605BDA', '#D50119', '#E8BE3C', '#3ED997', '#E4E6EF'],
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

export {TotalComplaint}
