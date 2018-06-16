<script>
import Layout from '@layouts/main'
import { GetUserContent } from '@gql/user'

export default {
  page() {
    return {
      title: this.user.name,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.user.name}.`,
        },
      ],
    }
  },
  components: { Layout },
  props: {
    _user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: { id: '' },
      posts: [],
    }
  },
  apollo: {
    getUserContent: {
      query: GetUserContent,
      variables() {
        return {
          id: this && this.user && this.user.id ? this.user.id : '',
        }
      },
      result({ data }) {
        this.posts = data.getUserContent
      },
    },
  },
  mounted() {
    this.user = this._user
  },
}
</script>

<template>
  <Layout>
    <h1>
      <BaseIcon name="user" />
      {{ user.name }}
      Profile
    </h1>
    <pre>{{ user }}</pre>
    <pre>{{ posts }}</pre>
  </Layout>
</template>
