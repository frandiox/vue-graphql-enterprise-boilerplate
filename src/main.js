import Vue from 'vue'
import App from './app'
import router from '@router'
import '@components/globals'
import { tryToLogIn } from '@src/api/auth'

import { apolloProvider } from '@state/vue-apollo'

// Don't warn about using the dev version of Vue in development
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// Check for idtoken in hash
tryToLogIn()

const app = new Vue({
  provide: apolloProvider.provide(),
  router,
  render: h => h(App),
}).$mount('#app')

// If running inside Cypress
if (window.Cypress) {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`
  window.__app__ = app
}
