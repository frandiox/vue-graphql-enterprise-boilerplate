import CreateNote from './index'

describe('@views/create-note', () => {
  it('is a valid view', () => {
    expect(CreateNote).toBeAViewComponent()
  })
})
