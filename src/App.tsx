import { useCallback, useMemo, useState } from 'react'
import rawData from './data/calendar.json'
import type { CalendarEvent, ViewMode } from './types'
import { Header } from './components/Header'
import { Controls } from './components/Controls'
import { CalendarView } from './components/CalendarView'
import { ListView } from './components/ListView'
import { EventCard } from './components/EventCard'
import { EventDialog } from './components/EventDialog'

const events = rawData.events as CalendarEvent[]

function getInitialEvent() {
  const id = new URLSearchParams(window.location.search).get('event')
  return id ? events.find((event) => event.id === id) || null : null
}

export function App() {
  const [year, setYear] = useState(2027)
  const [view, setView] = useState<ViewMode>('calendar')
  const [category, setCategory] = useState('')
  const [action, setAction] = useState('')
  const [query, setQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(getInitialEvent)

  const yearEvents = useMemo(() => events.filter((event) => event.year === year), [year])
  const categories = useMemo(() => [...new Set(yearEvents.map((event) => event.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')), [yearEvents])
  const actions = useMemo(() => [...new Set(yearEvents.map((event) => event.action).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')), [yearEvents])
  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru')
    return yearEvents.filter((event) => {
      if (category && event.category !== category) return false
      if (action && event.action !== action) return false
      if (!normalizedQuery) return true
      return [event.title, event.category, event.subcategory, event.period, event.audience].join(' ').toLocaleLowerCase('ru').includes(normalizedQuery)
    })
  }, [yearEvents, category, action, query])

  const today = new Date()
  const upcoming = filteredEvents.filter((event) => new Date(`${event.date}T23:59:59`) >= today).slice(0, 3)
  const closest = upcoming.length ? upcoming : filteredEvents.slice(0, 3)

  const openEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    const url = new URL(window.location.href)
    url.searchParams.set('event', event.id)
    window.history.pushState({}, '', url)
  }, [])
  const closeEvent = useCallback(() => {
    setSelectedEvent(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('event')
    window.history.replaceState({}, '', url)
  }, [])

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="hero">
          <p className="hero-kicker">Бесплатный инструмент Smartway</p>
          <h1>Бухгалтерский налоговый календарь 2026–2027</h1>
          <p>Сроки сдачи бухгалтерской, налоговой и статистической отчётности, уплаты налогов и страховых взносов — в одном месте.</p>
        </section>
        <Controls year={year} category={category} action={action} query={query} view={view} categories={categories} actions={actions} onYearChange={(value) => { setYear(value); setCategory(''); setAction('') }} onCategoryChange={setCategory} onActionChange={setAction} onQueryChange={setQuery} onViewChange={setView} />

        <section className="content-heading">
          <div><h2>{view === 'calendar' ? `Календарь на ${year} год` : 'Ближайшие сроки'}</h2><p>{filteredEvents.length} событий по выбранным параметрам</p></div>
          {(category || action || query) && <button onClick={() => { setCategory(''); setAction(''); setQuery('') }}>Сбросить фильтры</button>}
        </section>

        {filteredEvents.length ? (
          view === 'calendar' ? <CalendarView year={year} events={filteredEvents} onOpen={openEvent} /> : <ListView year={year} events={filteredEvents} onOpen={openEvent} />
        ) : (
          <section className="empty-state"><h2>События не найдены</h2><p>Попробуйте изменить запрос или сбросить фильтры.</p><button onClick={() => { setCategory(''); setAction(''); setQuery('') }}>Сбросить фильтры</button></section>
        )}

        {view === 'calendar' && closest.length > 0 && (
          <section className="upcoming-section">
            <div className="content-heading"><div><h2>Ближайшие сроки</h2><p>События, на которые стоит обратить внимание</p></div></div>
            <div className="event-stack">{closest.map((event) => <EventCard event={event} onOpen={openEvent} key={event.id} />)}</div>
          </section>
        )}

        <section className="promo-card">
          <div><p className="promo-label">Полезные материалы Smartway</p><h2>Отчётность и аудит без ошибок в 2026/27</h2><p>Скачивайте руководство по бухучёту командировок: документы, НДС и НДФЛ, средний заработок, распределение расходов и подготовка отчётности.</p></div>
          <a href="https://smartway.today/" target="_blank" rel="noreferrer">Скачать бесплатно</a>
        </section>
      </main>
      <footer><span>© Smartway, {new Date().getFullYear()}</span><span>Данные синхронизированы из открытой таблицы проекта</span></footer>
      <EventDialog event={selectedEvent} onClose={closeEvent} />
    </div>
  )
}
