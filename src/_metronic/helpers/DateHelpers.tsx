// Format Date
export const formatDate = (date: Date | string) => {
  const newDate = new Date(date)

  const day = newDate.getUTCDate().toString().padStart(2, '0')
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'UTC'})
  const year = newDate.getUTCFullYear()

  return `${day} ${month} ${year}`
}

// Format Date With Time
export const formatDateWithTime = (date: Date | string) => {
  const newDate = new Date(date)

  const day = newDate.getUTCDate().toString().padStart(2, '0')
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'UTC'})
  const year = newDate.getUTCFullYear()
  const hours = newDate.getUTCHours().toString().padStart(2, '0')
  const minutes = newDate.getUTCMinutes().toString().padStart(2, '0')

  return `${day} ${month} ${year} pukul ${hours}:${minutes}`
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
