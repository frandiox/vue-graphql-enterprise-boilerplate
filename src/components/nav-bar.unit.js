import NavBar from './nav-bar'

const mountNavBar = options => {
  return mount(NavBar, {
    stubs: {
      BaseLink: {
        functional: true,
        render(h, { slots }) {
          return <a>{slots().default}</a>
        },
      },
      ...options.stubs,
    },
    ...options,
  })
}

describe('@components/nav-bar', () => {
  it(`displays the Navbar with Log In link`, () => {
    const { element } = mountNavBar({})
    expect(element.textContent.includes('Log in')).toBe(true)
  })

  it(`displays the user's name in the profile link`, () => {
    const wrapper = mountNavBar({})

    wrapper.setData({
      user: {
        name: 'User01',
        email: 'user01@sample.com',
      },
    })

    const profileRoute = wrapper.vm.loggedInNavRoutes.find(
      route => route.name === 'profile'
    )
    expect(profileRoute.title()).toEqual('Logged in as user01@sample.com')
    // expect(wrapper.element.textContent.includes('Log in')).toBe(false)
    // expect(
    //   wrapper.element.textContent.includes('Logged in as user01@sample.com')
    // ).toBe(true)
  })
})
