<script>
import Layout from '@layouts/main'
import appConfig from '@src/app.config'
import { authorizeSelf, signupSelf, passwordReset } from '@services/auth'

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
      reset_email: '',
      authError: null,
      isSuccess: false,
      inProgress: false,
      formProperties: {},
      showForgetPassword: false,
      inProgressForgetPassword: false,
      isSuccessForgetPassword: false,
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
      this.showForgetPassword = false
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
        .then(response => {
          this.inProgress = false
          this.isSuccess = true
          this.logIn()
        })
        .catch(error => {
          this.inProgress = false
          this.setError(error)
        })
    },

    resetPassword() {
      this.clearErrors()
      this.inProgressForgetPassword = true

      // This redirects to home page
      return passwordReset(this.reset_email)
        .then(response => {
          this.inProgressForgetPassword = false
          this.isSuccessForgetPassword = true
        })
        .catch(error => {
          this.inProgressForgetPassword = false
          this.setError(error)
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
        leftAction: this.showPasswordResetForm,
        rightLinkText: 'Create an account',
        rightAction: this.showSignUpForm,
        action: this.logIn,
      }
      this.clearErrors()
      this.clearContent()
    },

    showPasswordResetForm() {
      this.clearErrors()
      this.clearContent()
      this.showForgetPassword = true
    },

    clearErrors() {
      // Reset the authError if it existed.
      this.authError = null
    },

    clearContent() {
      this.username = ''
      this.password = ''
      this.reset_email = ''
      this.showForgetPassword = false
      this.isSuccessForgetPassword = false
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
        v-if="isSuccess"
        :class="[$style.messageContainer, $style.successContainer]"
      >
        <div :class="$style.textKeepNewLine">
          <span>Sign Up Successfull! Logging in...</span>
          <BaseIcon
            :class="$style.pullRight"
            name="sync"
            spin
          />
        </div>
      </div>
      <div
        v-if="authError && !showForgetPassword"
        :class="[$style.messageContainer, $style.errorContainer]"
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
            v-if="inProgress && !isSuccess"
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

    <div
      v-if="showForgetPassword"
      :class="$style.loginFormContainer"
    >
      <p
        v-if="!isSuccessForgetPassword"
        :class="$style.loginTitle"
      >
        Forgot yout password?
      </p>
      <p
        v-if="isSuccessForgetPassword"
        :class="[$style.loginTitle, $style.successMessage]"
      >
        <BaseIcon
          :class="$style.inlineIcon"
          name="plane"
        />
        <span>We've just sent you an email to reset your password</span>
      </p>
      <div
        v-if="inProgressForgetPassword"
        :class="[$style.messageContainer, $style.successContainer]"
      >
        <div :class="$style.textKeepNewLine">
          <span>Sending email...</span>
          <BaseIcon
            :class="$style.pullRight"
            name="sync"
            spin
          />
        </div>
      </div>
      <div
        v-if="authError && showForgetPassword"
        :class="[$style.messageContainer, $style.errorContainer]"
      >
        <div :class="$style.textKeepNewLine">{{ authError }}</div>
      </div>
      <form
        v-if="!isSuccessForgetPassword"
        :class="$style.form"
        @submit.prevent="resetPassword"
      >
        <BaseInput
          v-model="reset_email"
          name="resetEmail"
          placeholder="Email"
          type="email"
        />
        <BaseButton
          :disabled="inProgressForgetPassword"
          :class="$style.largeButton"
          type="submit"
        >
          <span>Reset My Password</span>
        </BaseButton>
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
  color: $color-login-form-title;
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
  background: $color-login-form-container;
}

.pullLeft {
  float: left;
}

.pullRight {
  float: right;
}

.messageContainer {
  padding: 10px;
  margin-bottom: 20px;
  color: $color-error-text;
  text-align: left;
}

.errorContainer {
  background: $color-error-container;
}

.successContainer {
  background: $color-success-container;
}

.successMessage {
  color: $color-link-text;
}

.textKeepNewLine {
  white-space: pre-line;
}

.inlineIcon {
  margin-right: 10px;
}

.form {
  text-align: center;
}
</style>
