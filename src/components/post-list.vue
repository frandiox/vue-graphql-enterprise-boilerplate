<script>
import PostContainer from '@components/post-container'

export default {
  components: { PostContainer },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div>
    <PostContainer
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :show-author="showAuthor"
      :editable="editable"
      :class="$style.postContainer"
      v-on="$listeners"
    />
  </div>
</template>

<style lang="scss" module>
@import '@design';

.postContainer {
  width: 90%;
  margin: 20px auto;
}
</style>
