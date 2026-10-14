import type { CalendarEvent } from '../types'

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function MonthCard({ month, year, events, onOpen }: { month: number; year: number; events: CalendarEvent[]; onOpen: (event: CalendarEvent) => void }) {
  const days = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const byDay = new Map<number, CalendarEvent[]>()
  events.forEach((event) => {
    const day = Number(event.date.slice(8, 10))
    byDay.set(day, [...(byDay.get(day) || []), event])
  })
  return (
    <article className="month-card">
      <div className="month-heading"><h3>{months[month]}</h3><span>{events.length} событий</span></div>
      <div className="weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="days-grid">
        {Array.from({ length: offset }).map((_, index) => <span className="empty-day" key={`empty-${index}`} />)}
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1
          const dayEvents = byDay.get(day) || []
          return dayEvents.length ? (
            <button className="calendar-day deadline" onClick={() => onOpen(dayEvents[0])} title={dayEvents.map((event) => event.title).join('\n')} key={day}>
              <span>{day}</span><i>{Math.min(dayEvents.length, 3)}</i>
            </button>
          ) : <span className="calendar-day" key={day}>{day}</span>
        })}
      </div>
    </article>
  )
}

export function CalendarView({ year, events, onOpen }: { year: number; events: CalendarEvent[]; onOpen: (event: CalendarEvent) => void }) {
  return (
    <section className="calendar-grid" aria-label={`Календарь на ${year} год`}>
      {months.map((_, month) => <MonthCard month={month} year={year} events={events.filter((event) => event.month === month + 1)} onOpen={onOpen} key={month} />)}
    </section>
  )
}
