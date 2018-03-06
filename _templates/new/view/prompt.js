module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'View components must have a name.'
      }
      return true
    },
  },
  {
    type: 'confirm',
    name: 'folder',
    message: 'Create its own folder?',
  },
  {
    type: 'confirm',
    name: 'useStyles',
    message: 'Add <style> block?',
  },
]
