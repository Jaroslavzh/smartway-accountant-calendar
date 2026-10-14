import type { CalendarEvent } from '../types'
import { EventCard } from './EventCard'

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

export function ListView({ year, events, onOpen }: { year: number; events: CalendarEvent[]; onOpen: (event: CalendarEvent) => void }) {
  const groups = months.map((name, index) => ({ name, events: events.filter((event) => event.month === index + 1) })).filter((group) => group.events.length)
  return (
    <section className="list-view" aria-label={`Список событий на ${year} год`}>
      {groups.map((group) => (
        <section className="month-group" key={group.name}>
          <div className="group-heading"><h3>{group.name} {year}</h3><span>{group.events.length} событий</span></div>
          <div className="event-stack">{group.events.map((event) => <EventCard event={event} onOpen={onOpen} key={event.id} />)}</div>
        </section>
      ))}
    </section>
  )
}
