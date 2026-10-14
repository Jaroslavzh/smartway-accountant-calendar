import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const SHEET_ID = '1HXCcYZhCgIYJRdI_AJVL3WRpU8o4yBMyaPxK68AillY'
const GID = '1665513959'
const SOURCE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`
const OUTPUT = resolve('src/data/calendar.json')

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i += 1
      } else if (char === '"') quoted = false
      else field += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''))
      rows.push(row)
      row = []
      field = ''
    } else field += char
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

function toIso(value) {
  const match = value?.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  return match ? `${match[3]}-${match[2]}-${match[1]}` : ''
}

async function getCsv() {
  const inputIndex = process.argv.indexOf('--input')
  if (inputIndex >= 0 && process.argv[inputIndex + 1]) {
    return readFile(process.argv[inputIndex + 1], 'utf8')
  }
  const response = await fetch(SOURCE)
  if (!response.ok) throw new Error(`Google Sheets: ${response.status}`)
  return response.text()
}

try {
  const csv = await getCsv()
  const [header, ...rows] = parseCsv(csv)
  const column = Object.fromEntries(header.map((name, index) => [name, index]))
  const pick = (row, name) => (row[column[name]] || '').trim()
  const events = rows
    .filter((row) => ['2026', '2027'].includes(pick(row, 'Год')))
    .map((row) => {
      const checked = pick(row, 'Проверенный крайний срок')
      const calculated = pick(row, 'Расчётный срок с переносами')
      const base = pick(row, 'Базовая дата без переносов')
      // Берём готовую дату из таблицы, не пересчитывая срок. Текстовые пометки
      // в поле проверки не должны перекрывать соседнее поле с готовой датой.
      const displayDate = [checked, calculated, base].find((value) => toIso(value)) || ''
      return {
        id: pick(row, 'ID'),
        year: Number(pick(row, 'Год')),
        month: Number(pick(row, 'Месяц')),
        date: toIso(displayDate),
        displayDate,
        category: pick(row, 'Категория'),
        subcategory: pick(row, 'Доп. категория'),
        action: pick(row, 'Действие'),
        title: pick(row, 'Событие'),
        period: pick(row, 'Период'),
        audience: pick(row, 'Кого касается'),
        dateStatus: pick(row, 'Статус даты'),
        transfers: pick(row, 'Переносы'),
        source: pick(row, 'Источник правила'),
        note: pick(row, 'Примечание'),
      }
    })
    .filter((event) => event.id && event.date)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ru'))

  await mkdir(dirname(OUTPUT), { recursive: true })
  await writeFile(OUTPUT, `${JSON.stringify({ source: SOURCE, syncedAt: new Date().toISOString(), events }, null, 2)}\n`)
  console.log(`Synced ${events.length} events (${events.filter((e) => e.year === 2026).length} for 2026, ${events.filter((e) => e.year === 2027).length} for 2027).`)
} catch (error) {
  try {
    await readFile(OUTPUT, 'utf8')
    console.warn(`Sync failed, using committed data: ${error.message}`)
  } catch {
    throw error
  }
}
