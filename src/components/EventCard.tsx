import type { CalendarEvent } from '../types'

const monthShort = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export function EventCard({ event, onOpen }: { event: CalendarEvent; onOpen: (event: CalendarEvent) => void }) {
  const date = new Date(`${event.date}T12:00:00`)
  return (
    <button className="event-card" onClick={() => onOpen(event)}>
      <span className="date-tile"><b>{date.getDate().toString().padStart(2, '0')}</b><small>{monthShort[date.getMonth()]}</small></span>
      <span className="event-copy">
        <span className="eyebrow">{event.category}</span>
        <strong>{event.title}</strong>
        <small>{event.period ? `Период: ${event.period}` : event.audience}</small>
      </span>
      <span className="event-type">{event.action || 'Событие'}</span>
    </button>
  )
}
