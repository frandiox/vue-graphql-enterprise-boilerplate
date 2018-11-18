// https://date-fns.org/docs/parse
import parseDate from 'date-fns/parse'
// https://date-fns.org/docs/format
import format from 'date-fns/format'

export default function formatDate(date, template = 'MMM Do, YYYY') {
  date = parseDate(date)
  return format(date, template)
}
