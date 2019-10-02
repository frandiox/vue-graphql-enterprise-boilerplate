import PostList from './post-list'

describe('@components/post-list', () => {
  it(`displays a list of given posts`, () => {
    const wrapper = mount(PostList, {
      propsData: {
        posts: [{ title: 'post1' }, { title: 'post2' }],
      },
    })
    expect(wrapper.findAll('[data-test=postItem]').length).toEqual(2)
  })
})
