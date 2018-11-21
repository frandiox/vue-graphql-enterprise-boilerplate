# Authentication

As mentioned in [Backend technologies section](techback.md), we rely on [Auth0](https://auth0.com) for authentication.

This boilerplate uses a custom login page and `auth0.js` library but feel free to use Auth0's Universal Login Page instead if you prefer.

After creating a free account in Auth0, create a new application (Single Page Application) and define the following fields accordingly to your environment (i.e. adjust localhost's port for development or use another domain for staging/production):

- `Allowed Callback URLs`: `http://localhost:8080/login`.
- `Allowed Web Origins`: `http://localhost:8080`.
- `Allowed Logout URLs`: `http://localhost:8080/login`.

Our login page handles Auth0 callback and logout redirection. This can be changed in `auth.js` frontend service.

Make sure you also enable `Use Auth0 instead of the IdP to do Single Sign On` as well. This will allow us to renew tokens in the background when the session expires. Optionally, enable `Advanced Settings > OAuth > OIDC Conformant`.

After the app is create, go to APIs and create a new one (do not use the default Management API). You can customize its settings but defaults also work. Make sure to note the Identifier of the API.

Finally, update `.env` with your new Auth0 app domain, app client ID and the new API's ID (audience).

## Authorization

WIP
