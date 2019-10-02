import PostContainer from './post-container'

describe('@components/post-container', () => {
  it(`displays a given user post`, () => {
    const post = {
      title: 'test title',
      text: 'test text',
      updatedAt: '2019-09-28T00:00:00.000Z',
      author: { name: 'John' },
    }

    const wrapper = shallowMount(PostContainer, {
      propsData: { showAuthor: true, post },
    })

    expect(wrapper.find('[data-test=postAuthorLink]').text()).toBe(
      post.author.name
    )
    expect(wrapper.find('[data-test=postUpdatedAt]').text()).toMatch(
      /Sep 28th, 2019/
    )
    expect(wrapper.find('[data-test=postText]').text()).toMatch(post.text)
  })

  it(`enables editing a post`, async () => {
    const post = {
      title: 'test title',
      text: 'test text',
      updatedAt: '2019-09-28T00:00:00.000Z',
      author: { name: 'John' },
    }

    const wrapper = mount(PostContainer, {
      propsData: { editable: true, post },
    })
    // showAuthor is false by default
    expect(wrapper.find('[data-test=postAuthorLink]').exists()).toBe(false)

    // Can alter the post and emit save-post
    wrapper.setData({ text: 'update text' })
    await wrapper.vm.$nextTick()
    wrapper.find('[data-test=saveButton]').trigger('click')
    expect(wrapper.emitted('save-post')).toHaveLength(1)
  })
})
