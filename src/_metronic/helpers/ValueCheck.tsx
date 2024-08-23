import {PaginationProps} from 'antd'

// Value Check if value is not null, undefined, empty or 0
export const valueCheck = (key: string, value: string | number | Date) => {
  if (value !== null && value !== undefined && value !== '' && value !== 0) {
    return `${key}${value}`
  }
  return ''
}

// Render Custom Pagination
export const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Prev</a>
  }
  if (type === 'next') {
    return <a>Next</a>
  }
  return originalElement
}
