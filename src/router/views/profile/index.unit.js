import Profile from '.'

describe('@views/profile', () => {
  it('is a valid view', () => {
    expect(Profile).toBeAViewComponentUsing({ profileOwner: { name: '' } })
  })

  /*  it(`includes the provided user's name`, () => {
    const { element } = shallowMountView(Profile, {
      propsData: {
        propUser: { name: 'My Name' },
      },
    })

    console.log(element)
    expect(element.textContent).toMatch(/My Name\s+Profile/)
  }) */
})
