import { findUser } from '../models/user'
import { findPost, findPostList } from '../models/post'

export default {
  feed(parent, args, ctx, info) {
    return findPostList({ where: { isPublished: true } }, { info })
  },

  drafts(parent, args, ctx, info) {
    return findPostList(
      { where: { author: { id: ctx.req.user.id } } },
      { info }
    )
  },

  post(parent, { id }, ctx, info) {
    return findPost({ where: { id } }, { info })
  },

  self(parent, args, ctx, info) {
    return ctx.req.user
      ? findUser({ where: { id: ctx.req.user.id } }, { info })
      : null
  },

  auth(parent, { authId }, ctx, info) {
    return authId && ctx.req.get('x-audience') !== process.env.AUTH0_AUDIENCE
      ? findUser({ where: { authId } }, { info })
      : null
  },

  user(parent, { id }, ctx, info) {
    return findUser({ where: { id } }, { info })
  },

  userContent(parent, { id }, ctx, info) {
    return findPostList(
      {
        where: {
          isPublished:
            ctx.req.user && ctx.req.user.id === id ? undefined : true,
          author: {
            id,
          },
        },
      },
      { info }
    )
  },

  recentPosts(parent, args, ctx, info) {
    return findPostList(
      {
        first: 10,
        orderBy: 'updatedAt_DESC',
        where: { isPublished: true },
      },
      { info }
    )
  },
}
