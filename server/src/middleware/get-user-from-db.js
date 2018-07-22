export default async function(req, res, next, db) {
  if (req.user) {
    const user = await db.query.user({
      where: { auth0id: req.user.sub.split(`|`)[1] },
    })

    // Expose user in request object
    req.user = { token: req.user, ...user }
  }

  next()
}
