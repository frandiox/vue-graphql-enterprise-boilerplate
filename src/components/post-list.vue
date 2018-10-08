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
    <div
      v-for="(post, index) in posts"
      :key="post.title"
    >
      <PostContainer
        :post="post"
        :show-author="showAuthor"
        :editable="editable"
        :class="$style.postContainer"
        @save-post="$emit('save-post', index, $event)"
        @publish-draft="$emit('publish-draft', index, $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.postContainer {
  width: 90%;
  margin: 20px auto;
}
</style>
