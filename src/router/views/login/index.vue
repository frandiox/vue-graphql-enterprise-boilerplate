<script>
import Layout from '@layouts/main'
import appConfig from '@src/app.config'
import { authorizeSelf } from '@services/auth'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: '',
      password: '',
      authError: null,
      tryingToLogIn: false,
    }
  },
  methods: {
    // Try to log the user in with the username
    // and password they provided.
    logIn() {
      // Reset the authError if it existed.
      this.authError = null
      this.tryingToLogIn = true

      // This redirects to home page
      return authorizeSelf(this.username, this.password).catch(error => {
        this.tryingToLogIn = false
        this.authError = error
      })
    },
  },
}
</script>

<template>
  <Layout>
    <form
      :class="$style.form"
      @submit.prevent="logIn"
    >
      <BaseInput
        v-model="username"
        name="username"
      />
      <BaseInput
        v-model="password"
        name="password"
        type="password"
      />
      <BaseButton
        :disabled="tryingToLogIn"
        type="submit"
      >
        <BaseIcon
          v-if="tryingToLogIn"
          name="sync"
          spin
        />
        <span v-else>Log in</span>
      </BaseButton>
      <p v-if="authError">
        There was an error logging in to your account.
      </p>
    </form>
  </Layout>
</template>

<style lang="scss" module>
@import '~@design';

.form {
  text-align: center;
}
</style>
