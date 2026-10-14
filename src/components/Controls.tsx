import type { ViewMode } from '../types'

type ControlsProps = {
  year: number
  category: string
  action: string
  query: string
  view: ViewMode
  categories: string[]
  actions: string[]
  onYearChange: (year: number) => void
  onCategoryChange: (value: string) => void
  onActionChange: (value: string) => void
  onQueryChange: (value: string) => void
  onViewChange: (view: ViewMode) => void
}

export function Controls(props: ControlsProps) {
  return (
    <section className="controls" aria-label="Фильтры календаря">
      <div className="year-switch" aria-label="Выбор года">
        {[2027, 2026].map((item) => (
          <button className={props.year === item ? 'active' : ''} onClick={() => props.onYearChange(item)} key={item}>{item}</button>
        ))}
      </div>
      <div className="filter-row">
        <label>
          <span className="sr-only">Категория отчётности</span>
          <select value={props.category} onChange={(event) => props.onCategoryChange(event.target.value)}>
            <option value="">Все виды отчётности</option>
            {props.categories.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Тип события</span>
          <select value={props.action} onChange={(event) => props.onActionChange(event.target.value)}>
            <option value="">Все типы событий</option>
            {props.actions.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="search-field">
          <span className="sr-only">Поиск</span>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" /></svg>
          <input value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Найти событие" />
        </label>
      </div>
      <div className="view-switch" role="group" aria-label="Вид календаря">
        <button className={props.view === 'calendar' ? 'active' : ''} onClick={() => props.onViewChange('calendar')}>Календарь</button>
        <button className={props.view === 'list' ? 'active' : ''} onClick={() => props.onViewChange('list')}>Список</button>
      </div>
    </section>
  )
}
