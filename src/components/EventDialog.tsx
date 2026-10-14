import { useEffect } from 'react'
import type { CalendarEvent } from '../types'

export function EventDialog({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return
    const close = (keyEvent: KeyboardEvent) => keyEvent.key === 'Escape' && onClose()
    document.addEventListener('keydown', close)
    document.body.classList.add('dialog-open')
    return () => {
      document.removeEventListener('keydown', close)
      document.body.classList.remove('dialog-open')
    }
  }, [event, onClose])
  if (!event) return null
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(mouseEvent) => mouseEvent.target === mouseEvent.currentTarget && onClose()}>
      <article className="event-dialog" role="dialog" aria-modal="true" aria-labelledby="event-title">
        <button className="dialog-close" onClick={onClose} aria-label="Закрыть">×</button>
        <p className="eyebrow">{event.category} · {event.action}</p>
        <h2 id="event-title">{event.title}</h2>
        <p className="dialog-date">{event.displayDate}</p>
        <dl>
          {event.period && <><dt>Период</dt><dd>{event.period}</dd></>}
          {event.audience && <><dt>Кого касается</dt><dd>{event.audience}</dd></>}
          {event.transfers && <><dt>Переносы</dt><dd>{event.transfers}</dd></>}
          {event.note && <><dt>Примечание</dt><dd>{event.note}</dd></>}
        </dl>
        {event.source && <a className="source-link" href={event.source} target="_blank" rel="noreferrer">Открыть источник правила ↗</a>}
      </article>
    </div>
  )
}
