<script>
import Layout from '@layouts/main'
import PostList from '@components/post-list'
import { GetUserContent } from '@gql/user'
import { makeDraft, publishDraft, updateContent } from '@services/posts'

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
  components: { Layout, PostList },
  props: {
    propUser: {
      type: Object,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      user: { id: '' },
      posts: [],
      drafts: [],
      newTitle: '',
      newText: '',
      inProcess: false,
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
        const allPosts = JSON.parse(JSON.stringify(data.getUserContent))
        this.posts = allPosts.filter(post => post.isPublished)
        this.drafts = allPosts.filter(post => !post.isPublished)
      },
    },
  },
  mounted() {
    this.user = this.propUser
  },
  methods: {
    submitPost() {
      this.inProcess = true
      makeDraft(this.newTitle, this.newText)
        .then(result => {
          if (result.data && result.data.createDraft) {
            const newDraft = result.data.createDraft
            this.$set(this.drafts, this.drafts.length, newDraft)
          } else {
            console.error(result)
          }
        })
        .finally(() => {
          this.newTitle = ''
          this.newText = ''
          this.inProcess = false
        })
    },
    editPost(index, newPostData, isDraft) {
      const oldPost = (isDraft ? this.drafts : this.posts)[index]

      this.$set(isDraft ? this.drafts : this.posts, index, {
        ...(isDraft ? this.drafts : this.posts)[index],
        title: newPostData.title,
        text: newPostData.text,
        editing: true,
      })
      updateContent(
        (isDraft ? this.drafts : this.posts)[index].id,
        newPostData.title,
        newPostData.text
      )
        .then(result => {
          if (!result.data || !result.data.updatePost) {
            this.$set(isDraft ? this.drafts : this.posts, index, {
              ...(isDraft ? this.drafts : this.posts)[index],
              title: oldPost.title,
              text: oldPost.text,
            })
            console.error(result)
          }
        })
        .finally(() => {
          this.$set(isDraft ? this.drafts : this.posts, index, {
            ...(isDraft ? this.drafts : this.posts)[index],
            editing: false,
          })
        })
    },
    publishDraft(index, newPost) {
      this.$set(this.drafts, index, {
        ...this.drafts[index],
        editing: true,
      })
      publishDraft(this.drafts[index].id).then(result => {
        if (result.data && result.data.publish) {
          this.$delete(this.drafts, index)
          this.$set(this.posts, this.posts.length, result.data.publish)
        } else {
          this.$set(this.drafts, index, {
            ...this.drafts[index],
            editing: false,
          })

          console.error(result)
        }
      })
    },
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
    <div v-if="posts.length > 0">
      <h2>Posts</h2>
      <PostList
        :posts="posts"
        :editable="!readOnly"
        @save-post="editPost(...arguments, false)"
      />
    </div>
    <div v-if="drafts.length > 0">
      <h2>Drafts</h2>
      <PostList
        :posts="drafts"
        :editable="!readOnly || 1===1"
        @save-post="editPost(...arguments, true)"
        @publish-draft="publishDraft"
      />
    </div>
    <div v-if="!readOnly">
      <h2>Write a new post</h2>
      <div :class="$style.postFormContainer">
        <form
          :class="$style.form"
          @submit.prevent="submitPost"
        >
          <BaseButton
            v-if="inProcess"
            :disabled="inProcess"
            :class="$style.actionButton"
          >
            <BaseIcon
              name="sync"
              spin
            />
          </BaseButton>
          <div v-else>
            <BaseInput
              v-model="newTitle"
              placeholder="Title"
            />
            <textarea
              v-model="newText"
              :class="$style.resizable"
              placeholder="Write your post here!"
            />
            <BaseButton
              :class="$style.publishButton"
              type="submit"
            >
              <span>Save as draft</span>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.postFormContainer {
  box-sizing: content-box;
  width: 80%;
  margin: auto;
  background: $color-login-form-container;
}

.form {
  text-align: center;
}

.resizable {
  width: 100%;
  height: 10em;
  min-height: 5em;
  max-height: 20em;
  padding: $size-input-padding-vertical $size-input-padding-horizontal;
  margin-bottom: $size-grid-padding;
  line-height: 1;
  vertical-align: top;
  resize: vertical;
  border: $size-input-border solid $color-input-border;
  border-radius: $size-input-border-radius;
}

.publishButton {
  width: 50%;
}
</style>
