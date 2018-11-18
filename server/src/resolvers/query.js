export default {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },

  drafts(parent, args, ctx, info) {
    const id = ctx.req.user.id

    const where = {
      isPublished: false,
      author: {
        id,
      },
    }

    return ctx.db.query.posts({ where }, info)
  },

  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },

  self(parent, args, ctx, info) {
    const { token, ...user } = ctx.req.user || {}
    return user.id ? user : null
  },

  user(parent, { id }, ctx, info) {
    return ctx.db.query.user({ where: { id } }, info)
  },

  userContent(parent, { id }, ctx, info) {
    const where = {
      ...((!ctx.req.user || ctx.req.user.id !== id) && {
        isPublished: true,
      }),
      author: {
        id,
      },
    }

    return ctx.db.query.posts({ where }, info)
  },

  recentPosts(parent, args, ctx, info) {
    return ctx.db.query.posts(
      { first: 10, orderBy: 'updatedAt_DESC', where: { isPublished: true } },
      info
    )
  },
}
