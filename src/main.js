import Vue from 'vue'
import App from './app'
import router from '@router'
import '@components/globals'

import { apolloProvider } from '@state'

// Don't warn about using the dev version of Vue in development
Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.prototype.$log = (...args) => console.log(...args) // eslint-disable-line no-console

const app = new Vue({
  apolloProvider,
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
