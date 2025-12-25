import dayjs from 'dayjs'

// Format Date
export const formatDate = (date: Date | string) => {
  if (!date) return '-'

  const newDate = new Date(date)

  // UTC
  const day = newDate.getUTCDate().toString().padStart(2, '0')
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'UTC'})
  const year = newDate.getUTCFullYear()

  return `${day} ${month} ${year}`
}

export const formatDateTimeZone = (date: Date | string) => {
  if (!date) return '-'

  const newDate = new Date(date)

  // Time Zone
  const day = newDate.toLocaleString('id-ID', {day: '2-digit', timeZone: 'Asia/Jakarta'})
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'Asia/Jakarta'})
  const year = newDate.toLocaleString('id-ID', {year: 'numeric', timeZone: 'Asia/Jakarta'})

  return `${day} ${month} ${year}`
}

// Format Date With Time
export const formatDateWithTime = (date: Date | string) => {
  if (!date) return '-'

  const newDate = new Date(date)

  // UTC
  const day = newDate.getUTCDate().toString().padStart(2, '0')
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'UTC'})
  const year = newDate.getUTCFullYear()
  const hours = newDate.getUTCHours().toString().padStart(2, '0')
  const minutes = newDate.getUTCMinutes().toString().padStart(2, '0')

  return `${day} ${month} ${year} pukul ${hours}:${minutes}`
}

export const formatDateNoTime = (date: Date | string) => {
  if (!date) return '-'

  const newDate = new Date(date)

  // UTC
  const day = newDate.getUTCDate().toString().padStart(2, '0')
  const month = newDate.toLocaleString('id-ID', {month: 'long', timeZone: 'UTC'})
  const year = newDate.getUTCFullYear()
  const hours = newDate.getUTCHours().toString().padStart(2, '0')
  const minutes = newDate.getUTCMinutes().toString().padStart(2, '0')

  return `${day} ${month} ${year}`
}

export const formatDateWithTimeZone = (date: Date | string) => {
  if (!date) return '-'

  const newDate = new Date(date)

  // Time Zone
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

// Format Input Date
export const formatInputDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

// Disable Date Before Today
export const disableDateBeforeToday = (date: dayjs.Dayjs) => {
  const today = dayjs().startOf('day')
  return date.isBefore(today, 'day')
}

// Disable Hours
export const range = (start: number, end: number): number[] =>
  Array.from({length: end - start}, (_, i) => start + i)
export const disabledHoursSessionMorning = (): number[] =>
  range(0, 24).filter((hour) => hour < 8 || hour > 11)
export const disabledHoursSessionAfternoon = (): number[] =>
  range(0, 24).filter((hour) => hour < 12 || hour > 15)
export const disabledHoursSessionNight = (): number[] =>
  range(0, 24).filter((hour) => hour < 15 || hour > 21)
export const disabledHoursSessionLateNight = (): number[] =>
  range(0, 24).filter((hour) => hour < 21 || hour > 23)

// Function Disable Hours (for input order session)
export const getDisabledHours = (session: string): number[] => {
  switch (session) {
    case 'Sesi Pagi':
      return disabledHoursSessionMorning()
    case 'Sesi Siang':
      return disabledHoursSessionAfternoon()
    case 'Sesi Sore':
      return disabledHoursSessionNight()
    case 'Sesi Malam':
      return disabledHoursSessionLateNight()
    default:
      return []
  }
}
