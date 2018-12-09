# Authentication

As mentioned in [Backend technologies section](techback.md), we rely on [Auth0](https://auth0.com) for authentication.

This boilerplate uses a custom login page and `auth0-js` library but feel free to use Auth0's Universal Login Page instead if you prefer.

After creating a free account in Auth0, create a new application (Single Page Application) and define the following fields accordingly to your environment (i.e. adjust localhost's port for development or use another domain for staging/production):

- `Allowed Callback URLs`: `http://localhost:8080/login`.
- `Allowed Web Origins`: `http://localhost:8080`.
- `Allowed Logout URLs`: `http://localhost:8080/login`.

Our login page handles Auth0 callback and logout redirection. This can be changed in `auth.js` frontend service.

Make sure you also enable `Use Auth0 instead of the IdP to do Single Sign On` as well. This will allow to make token renewals in the background when the session expires. Optionally, enable `Advanced Settings > OAuth > OIDC Conformant`.

After the app is created, go to APIs section and create a new one (do not use the default Management API). You can customize its settings but defaults also work. Make sure to note the Identifier of the API.

Finally, update `.env` with your new Auth0 app domain, app client ID and the new API's ID (audience). Optionally, you can add an [OIDC namespace](https://auth0.com/docs/api-auth/tutorials/adoption/scope-custom-claims) variable to add extra information to the tokens.

## Authorization

Apart from checking ownership of resources, authorization will be based on roles. Every user has a role assigned that will change its view and permissions in the app.

These roles are defined as enums in the database and assigned to the User type. Authorization will be asserted via directives (e.g. `@hasRole(value: "ADMIN")`), which are defined in `server/src/directives/auth.js`.

To make this work, our middleware needs to verify the access token attached to the headers and find the existing user information in our DB. This way, we have user's `id` and `role` by the time the directives and resolvers are called.

The main advantage of this strategy is keeping all the important information within our system instead of delegating roles/scopes to Auth0. However, it also has a drawback: every request needs to make 1 request to fetch user permissions, which may incur a small delay. Luckily, there is a workaround for this.

### Extending Access Token information

Auth0 allows to customize both id and access tokens. The idea is to provide user's `id` and `role` inside the access token to prevent extra DB requests later on. In order to do this, we define a new query `auth` that returns the role for a given user and call it from an Auth0 rule that modifies the access token on login.

The following rule makes a query to our application and modifies the access token with the returned information:

```js
function extendAccessToken(user, context, callback) {
  const fetch = require('isomorphic-fetch')

  const audience =
    (context.request &&
      context.request.query &&
      context.request.query.audience) ||
    (context.request && context.request.body && context.request.body.audience)

  const headers = { 'x-audience': audience }

  const body = JSON.stringify({
    query: `
      query Auth($authId: String!) {
        auth(authId: $authId) { id role }
      }
    `,
    variables: {
      authId: user.user_id,
    },
  })

  // Make a GraphQL request over HTTP
  fetch(configuration.API_ENDPOINT, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    body,
  })
    .then(response => response.ok && response.json())
    .then(result => {
      if (result && !result.errors && result.data) {
        // Add result to accessToken using our OIDC namespace
        context.accessToken[configuration.NAMESPACE + 'auth'] =
          result.data.getAuth
      }

      return callback(null, user, context)
    })
    .catch(err => callback(null, user, context)) // Swallow errors
}
```

Note that the previous rule assumes that both API endpoint and OIDC namespace are provided as environment variable in Auth0 (inside `configuration` global object). The namespace must match the value of `AUTH0_OIDC_NAMESPACE` environment variable we set in our server's `.env` file.
