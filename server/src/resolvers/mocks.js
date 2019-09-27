const randomString = () =>
  Math.random()
    .toString(36)
    .substring(2, 15)

export default {
  Int(obj, args, context, field) {
    return obj[field.fieldName] || 42
  },
  String(obj, args, context, field) {
    return obj[field.fieldName] || `Mock-${randomString()}`
  },
  DateTime(obj, args, context, field) {
    return obj[field.fieldName] || new Date(Date.now())
  },
  Json(obj, args, context, field) {
    return obj[field.fieldName] || null
  },
}
