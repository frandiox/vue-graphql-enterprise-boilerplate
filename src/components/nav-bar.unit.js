import NavBar from './nav-bar'

describe('@components/nav-bar', () => {
  it(`displays the user's name in the profile link`, async () => {
    const { vm } = shallowMount(
      NavBar,
      createComponentMocks({
        resolvers: {
          Query: {
            self: () => ({ name: 'My Name' }),
          },
        },
      })
    )

    await vm.$nextTick() // Needed for Apollo

    const profileRoute = vm.loggedInNavRoutes.find(
      route => route.name === 'user-profile'
    )
    expect(profileRoute.title()).toEqual('Logged in as My Name')
  })
})
