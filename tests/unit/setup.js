import Vue from 'vue'
import fs from 'fs'
import path from 'path'

// ===
// Utility functions
// ===

// https://vue-test-utils.vuejs.org/en/
import vueTestUtils from '@vue/test-utils'
// https://lodash.com/
import _ from 'lodash'
_.mixin({ pascalCase: _.flow(_.camelCase, _.upperFirst) })

// ===
// Configure Vue
// ===

// Don't warn about not using the production build of Vue, as
// we care more about the quality of errors than performance
// for tests.
Vue.config.productionTip = false

// ===
// Register global components
// ===

const globalComponentFiles = fs
  .readdirSync(path.join(__dirname, '../../src/components/globals'))
  .filter(fileName => /^_base-.+\.vue$/.test(fileName))

for (const fileName of globalComponentFiles) {
  const componentName = _.pascalCase(fileName.match(/^_(base-.+)\.vue$/)[1])
  const componentConfig = require('../../src/components/globals/' + fileName)
  Vue.component(componentName, componentConfig.default || componentConfig)
}

// ===
// Patch all components with a global mixin
// ===

Vue.mixin({
  created() {
    // HACK: Set a fallback for the `$style` until vue-jest
    // includes better support for CSS modules.
    this.$style = this.$style || {}
  },
})

// ===
// Mock window properties not handled by jsdom
// ===

Object.defineProperty(window, 'localStorage', {
  value: (function() {
    let store = {}
    return {
      getItem: function(key) {
        return store[key] || null
      },
      setItem: function(key, value) {
        store[key] = value.toString()
      },
      clear: function() {
        store = {}
      },
    }
  })(),
})

// ===
// Global helpers
// ===

// https://vue-test-utils.vuejs.org/en/api/mount.html
global.mount = vueTestUtils.mount

// Aliasing `shallow` to a more descriptive name
// https://vue-test-utils.vuejs.org/en/api/shallow.html
global.mountShallow = vueTestUtils.shallow

// A special version of `mountShallow` for view components
global.mountShallowView = (Component, options = {}) => {
  return global.mountShallow(Component, {
    ...options,
    stubs: {
      Layout: {
        functional: true,
        render(h, { slots }) {
          return <div>{slots().default}</div>
        },
      },
      ...(options.stubs || {}),
    },
  })
}

// A helper for creating Vue component mocks
global.createComponentMocks = ({ store, router, style, mocks, stubs }) => {
  // Use a local version of Vue, to avoid polluting the global
  // Vue and thereby affecting other tests.
  // https://vue-test-utils.vuejs.org/en/api/createLocalVue.html
  const localVue = vueTestUtils.createLocalVue()
  const returnOptions = { localVue }

  // https://vue-test-utils.vuejs.org/en/api/options.html#stubs
  returnOptions.stubs = stubs || {}
  // https://vue-test-utils.vuejs.org/en/api/options.html#mocks
  returnOptions.mocks = mocks || {}

  // If using `router: true`, we'll automatically stub out
  // components from Vue Router.
  if (router) {
    returnOptions.stubs['router-link'] = true
    returnOptions.stubs['router-view'] = true
  }

  // If a `style` object is provided, mock some styles.
  if (style) {
    returnOptions.mocks.$style = style
  }

  return returnOptions
}

// Add 'fetch' to Node for Jest
global.fetch = require('jest-fetch-mock')
