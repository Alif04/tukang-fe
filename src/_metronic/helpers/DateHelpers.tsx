// Format Date
export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Format Date With Time
export const formatDateWithTime = (date: Date | string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

// Format Date Period
export const getFormattedPeriod = () => {
  const now = new Date()
  const lastMonth = new Date(now)
  lastMonth.setMonth(now.getMonth() - 1)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      month: 'long',
    })
  }

  return `${formatDate(lastMonth)} - ${formatDate(now)} ${now.getFullYear()}`
}
