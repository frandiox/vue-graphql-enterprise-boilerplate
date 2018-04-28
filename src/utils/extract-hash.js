export default function(location, history) {
  if (!location.hash) return {}

  const hash = location.hash
    .replace('#', '')
    .split('&')
    .reduce((acc, item) => {
      const [key, value] = item.split('=')
      acc[key] = value || ''
      return acc
    }, {})

  history.replaceState(null, '', location.href.split('#')[0])

  return hash
}
