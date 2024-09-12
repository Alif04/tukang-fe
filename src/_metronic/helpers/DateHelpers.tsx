// Format Date
export const formatDate = (date: Date | string) => {
  const newDate = new Date(date)

  const day = newDate.toLocaleString('id-ID', {day: '2-digit', timeZone: 'Asia/Jakarta'})
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'Asia/Jakarta'})
  const year = newDate.toLocaleString('id-ID', {year: 'numeric', timeZone: 'Asia/Jakarta'})

  return `${day} ${month} ${year}`
}

// Format Date With Time
export const formatDateWithTime = (date: Date | string) => {
  const newDate = new Date(date)

  const day = newDate.toLocaleString('id-ID', {day: '2-digit', timeZone: 'Asia/Jakarta'})
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'Asia/Jakarta'})
  const year = newDate.toLocaleString('id-ID', {year: 'numeric', timeZone: 'Asia/Jakarta'})
  const hours = newDate.toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false,
  })

  return `${day} ${month} ${year} pukul ${hours}`
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
