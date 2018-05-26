module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'GraphQL files must have a name.'
      }
      return true
    },
  },
  {
    type: 'input',
    name: 'view',
    message: "What's the parent view? (empty for a global gql)",
  },
]
