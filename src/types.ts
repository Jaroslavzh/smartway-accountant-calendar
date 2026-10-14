export type CalendarEvent = {
  id: string
  year: number
  month: number
  date: string
  displayDate: string
  category: string
  subcategory: string
  action: string
  title: string
  period: string
  audience: string
  dateStatus: string
  transfers: string
  source: string
  note: string
}

export type ViewMode = 'calendar' | 'list'
