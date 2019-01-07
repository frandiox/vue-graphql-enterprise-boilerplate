import {
  createPost,
  deletePost,
  isPostOwner,
  updatePost,
} from '../../models/post'

const postNotFoundMessage = `Post not found or you're not the author`

export default {
  async createDraft(parent, { title, text }, ctx, info) {
    const userId = ctx.req.user.id
    return createPost(
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
      { info }
    )
  },

  async publishPost(parent, { id }, ctx, info) {
    if (!(await isPostOwner(ctx.req.user, id))) {
      throw new Error(postNotFoundMessage)
    }

    return updatePost(
      {
        where: { id },
        data: { isPublished: true },
      },
      info
    )
  },

  async updatePost(
    parent,
    {
      input: { id, title, text },
    },
    ctx,
    info
  ) {
    if (!(await isPostOwner(ctx.req.user, id))) {
      throw new Error(postNotFoundMessage)
    }

    return updatePost(
      {
        where: { id },
        data: { title, text },
      },
      info
    )
  },

  async deletePost(parent, { id }, ctx, info) {
    if (!(await isPostOwner(ctx.req.user, id))) {
      throw new Error(postNotFoundMessage)
    }

    return deletePost({ where: { id } }, { info })
  },
}
