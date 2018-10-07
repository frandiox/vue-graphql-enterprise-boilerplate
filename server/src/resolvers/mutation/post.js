export default {
  async createDraft(parent, { title, text }, ctx, info) {
    const userId = ctx.req.user.id
    return ctx.db.mutation.createPost(
      {
        data: {
          title,
          text,
          isPublished: false,
          author: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },

  async publish(parent, { id }, ctx, info) {
    const userId = ctx.req.user.id
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.updatePost(
      {
        where: { id },
        data: { isPublished: true },
      },
      info
    )
  },

  async updatePost(parent, { id, title, text }, ctx, info) {
    const userId = ctx.req.user.id
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.updatePost(
      {
        where: { id },
        data: { title, text },
      },
      info
    )
  },

  async deletePost(parent, { id }, ctx, info) {
    const userId = ctx.req.user.id
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.deletePost({ where: { id } })
  },
}
