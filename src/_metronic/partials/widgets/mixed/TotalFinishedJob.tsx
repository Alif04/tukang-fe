/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTSVG} from '../../../helpers'
import {getCSSVariableValue} from '../../../assets/ts/_utils'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
}

const TotalFinishedJob: React.FC<Props> = ({className, chartColor, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartColor, chartHeight))
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
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-5'>
          <div className='d-flex flex-column  gap-4'>
            <div className='fs-5 text-dark text-muted'>Total Penyelesaian Pekerjaan</div>
            <div className='fs-1 fw-bold d-block m-auto'>17</div>
            <div className='fs-5 text-muted'>Pekerjaan selesai bulan ini</div>
          </div>

          <div ref={chartRef} className='mixed-widget-4-chart'></div>
        </div>
      </div>
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string): ApexOptions => {
  const baseColor = getCSSVariableValue('--kt-' + chartColor)
  const lightColor = getCSSVariableValue('--kt-' + chartColor + '-light')
  const labelColor = getCSSVariableValue('--kt-gray-700')

  return {
    series: [74],
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
    colors: [baseColor],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  }
}

export {TotalFinishedJob}
