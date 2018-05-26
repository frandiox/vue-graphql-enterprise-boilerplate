<script>
import Layout from '@layouts/main'
import appConfig from '@src/app.config'
import { authorizeSelf, signupSelf } from '@services/auth'

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
      signUpUsername: '',
      signUpPassword: '',
      authError: null,
      tryingToLogIn: false,
      tryingToSignUp: false,
      logInForm: true,
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
    // Try to create a new account for the user
    // with the username and password they provided.
    signUp() {
      // Reset the authError if it existed.
      this.authError = null
      this.tryingToSignUp = true

      // This redirects to home page
      return signupSelf(this.signUpUsername, this.signUpPassword)
        .catch(error => {
          this.tryingToSignUp = false
          this.authError = error
        })
        .then(() => {
          this.tryingToSignUp = false
        })
    },

    showSignUpForm() {
      this.logInForm = false
    },

    showLogInForm() {
      this.logInForm = true
    },
  },
}
</script>

<template>
  <Layout>
    <div
      v-if="logInForm"
      :class="$style.loginFormContainer"
    >
      <p :class="$style.loginTitle">Login to access your account</p>
      <form
        :class="$style.form"
        @submit.prevent="logIn"
      >
        <BaseInput
          v-model="username"
          name="username"
          placeholder="Email"
        />
        <BaseInput
          v-model="password"
          name="password"
          type="password"
          placeholder="Password"
        />
        <BaseButton
          :disabled="tryingToLogIn || tryingToSignUp"
          :class="$style.largeButton"
          type="submit"
        >
          <BaseIcon
            v-if="tryingToLogIn || tryingToSignUp"
            name="sync"
            spin
          />
          <span v-else>Log in</span>
        </BaseButton>
        <p v-if="authError">
          There was an error logging in to your account.
        </p>
        <div :class="$style.loginFormFooter">
          <span :class="$style.pullLeft">
            <a :class="$style.clickable">
              Forgot your password?
            </a>
          </span>
          <span :class="$style.pullRight">
            <a
              :class="$style.clickable"
              @click="showSignUpForm"
            >
              Create an account
            </a>
          </span>
        </div>
      </form>
    </div>
    <div
      v-if="!logInForm"
      :class="$style.loginFormContainer"
    >
      <p :class="$style.loginTitle">Create a new account</p>
      <form
        :class="$style.form"
        @submit.prevent="signUp"
      >
        <BaseInput
          v-model="signUpUsername"
          name="signUpUsername"
          placeholder="Email"
        />
        <BaseInput
          v-model="signUpPassword"
          name="signUpPassword"
          type="password"
          placeholder="Password"
        />
        <BaseButton
          :disabled="tryingToLogIn || tryingToSignUp"
          :class="$style.largeButton"
          type="submit"
        >
          <BaseIcon
            v-if="tryingToLogIn || tryingToSignUp"
            name="sync"
            spin
          />
          <span v-else>Sign up</span>
        </BaseButton>
        <p v-if="authError">
          There was an error logging in to your account.
        </p>
        <div :class="$style.loginFormFooter">
          <span :class="$style.pullRight">
            <a
              :class="$style.clickable"
              @click="showLogInForm">
              Already have an account
            </a>
          </span>
        </div>
      </form>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '~@design';

.largeButton {
  width: 100%;
}

.clickable {
  cursor: pointer;
}

.loginTitle {
  padding: 20px 0;
  font-size: 20px;
  color: #909090;
  text-align: center;
}

.loginFormFooter {
  padding: 10px 0;
  font-size: 13px;
}

.loginFormContainer {
  box-sizing: content-box;
  width: 50%;
  padding: 20px 20px 50px;
  margin: auto;
  background: #f9f6f4;
}

.pullLeft {
  float: left;
}

.pullRight {
  float: right;
}

.form {
  text-align: center;
}
</style>
