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
      authError: null,
      inProgress: false,
      formProperties: {},
    }
  },
  created() {
    this.showLogInForm()
  },
  methods: {
    // Try to log the user in with the username
    // and password they provided.
    logIn() {
      this.clearErrors()
      this.inProgress = true

      // This redirects to home page
      return authorizeSelf(this.username, this.password).catch(error => {
        this.inProgress = false
        this.setError(error)
      })
    },
    // Try to create a new account for the user
    // with the username and password they provided.
    signUp() {
      this.clearErrors()
      this.inProgress = true

      // This redirects to home page
      return signupSelf(this.username, this.password)
        .catch(error => {
          this.inProgress = false
          this.setError(error)
        })
        .then(() => {
          this.inProgress = false
        })
    },

    showSignUpForm() {
      this.formProperties = {
        title: 'Create a new account',
        buttonText: 'Sign up',
        leftLinkText: '',
        leftAction: () => {},
        rightLinkText: 'Already have an account',
        rightAction: this.showLogInForm,
        action: this.signUp,
      }
      this.clearErrors()
      this.clearContent()
    },

    showLogInForm() {
      this.formProperties = {
        title: 'Login to access your account',
        buttonText: 'Log in',
        leftLinkText: 'Forgot your password?',
        leftAction: () => {},
        rightLinkText: 'Create an account',
        rightAction: this.showSignUpForm,
        action: this.logIn,
      }
      this.clearErrors()
      this.clearContent()
    },

    clearErrors() {
      // Reset the authError if it existed.
      this.authError = null
    },

    clearContent() {
      this.username = ''
      this.password = ''
    },

    setError(error) {
      if (typeof error.description === 'string') {
        this.authError = error.description
      } else {
        this.authError = error.policy
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div
      :class="$style.loginFormContainer"
    >
      <p :class="$style.loginTitle">{{ formProperties.title }}</p>
      <div
        v-if="authError"
        :class="$style.errorContainer"
      >
        <div :class="$style.textKeepNewLine">{{ authError }}</div>
      </div>
      <form
        :class="$style.form"
        @submit.prevent="formProperties.action"
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
          :disabled="inProgress"
          :class="$style.largeButton"
          type="submit"
        >
          <BaseIcon
            v-if="inProgress"
            name="sync"
            spin
          />
          <span v-else>{{ formProperties.buttonText }}</span>
        </BaseButton>
        <div :class="$style.loginFormFooter">
          <span
            :v-if="formProperties.leftLinkText"
            :class="$style.pullLeft"
          >
            <a
              :class="$style.clickable"
              @click="formProperties.leftAction"
            >
              {{ formProperties.leftLinkText }}
            </a>
          </span>
          <span
            :v-if="formProperties.rightLinkText"
            :class="$style.pullRight"
          >
            <a
              :class="$style.clickable"
              @click="formProperties.rightAction"
            >
              {{ formProperties.rightLinkText }}
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

.errorContainer {
  padding: 10px;
  margin-bottom: 20px;
  color: white;
  text-align: left;
  background: #f84b4b;
}

.textKeepNewLine {
  white-space: pre-line;
}

.form {
  text-align: center;
}
</style>
