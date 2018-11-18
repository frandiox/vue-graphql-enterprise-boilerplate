<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PostList from '@components/post-list'
import { GetRecentPosts } from '@gql/user'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PostList },
  data() {
    return {
      recentPosts: [],
    }
  },
  apollo: {
    recentPosts: {
      query: GetRecentPosts,
    },
  },
}
</script>

<template>
  <Layout>
    <h1>Home Page</h1>
    <img
      class="logo"
      src="@assets/images/logo.png"
      alt="Logo"
    >
    <h2>Recent Posts</h2>
    <PostList
      :posts="recentPosts"
      show-author
    />
  </Layout>
</template>

<style lang="scss" scoped>
@import '@design';

.logo {
  max-width: 100%;
  height: auto;
}
</style>
