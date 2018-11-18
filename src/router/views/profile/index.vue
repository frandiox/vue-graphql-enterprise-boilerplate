<script>
import Layout from '@layouts/main'
import PostList from '@components/post-list'
import { GetUserContent, CreateDraft, PublishPost, UpdatePost } from '@gql/user'

export default {
  page() {
    return {
      title: this.profileOwner.name,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.profileOwner.name}.`,
        },
      ],
    }
  },
  components: { Layout, PostList },
  props: {
    user: {
      type: Object,
      default: null,
    },
    profileOwner: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newTitle: '',
      newText: '',
      isLoading: false,
      userContent: [],
    }
  },
  computed: {
    posts() {
      return this.userContent.filter(post => post.isPublished)
    },
    drafts() {
      return this.userContent.filter(post => !post.isPublished)
    },
    isOwner() {
      return this.user && this.user.id === this.profileOwner.id
    },
  },
  apollo: {
    userContent: {
      query: GetUserContent,
      variables() {
        return {
          id: this.profileOwner.id,
        }
      },
    },
  },
  methods: {
    async submitPost() {
      this.isLoading = true
      const variables = { title: this.newTitle, text: this.newText }
      const now = new Date().toISOString()
      const optimisticId = `new-post-${new Date().getTime()}`

      try {
        await this.$apollo.mutate({
          mutation: CreateDraft,
          variables,
          update: (cache, { data: { createDraft } }) => {
            cache.writeQuery({
              query: GetUserContent,
              variables: {
                id: this.profileOwner.id,
              },
              data: {
                userContent: [
                  ...this.userContent.filter(post => post.id !== optimisticId),
                  createDraft,
                ],
              },
            })
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createDraft: {
              __typename: 'Post',
              id: optimisticId,
              isPublished: false,
              createdAt: now,
              updatedAt: now,
              ...variables,
            },
          },
        })
      } catch (err) {
        console.error(err)
      }

      this.newTitle = ''
      this.newText = ''
      this.isLoading = false
    },
    async editPost(newPostData) {
      try {
        await this.$apollo.mutate({
          mutation: UpdatePost,
          variables: newPostData,
          optimisticResponse: {
            __typename: 'Mutation',
            updatePost: {
              __typename: 'Post',
              ...newPostData,
              updatedAt: new Date().toISOString(),
            },
          },
        })
      } catch (err) {
        console.error(err)
      }
    },
    async publishDraft(post) {
      await this.$apollo.mutate({
        mutation: PublishPost,
        variables: { id: post.id },
        optimisticResponse: {
          __typename: 'Mutation',
          publishPost: {
            __typename: 'Post',
            ...post,
            updatedAt: new Date().toISOString(),
            isPublished: true,
          },
        },
      })
    },
  },
}
</script>

<template>
  <Layout>
    <h1>
      <BaseIcon name="user" />
      {{ profileOwner.name }}
      Profile
    </h1>
    <pre>{{ profileOwner }}</pre>

    <div v-if="isOwner">
      <h2>Write a new post</h2>
      <div :class="$style.postFormContainer">
        <form
          :class="$style.form"
          @submit.prevent="submitPost"
        >
          <BaseButton
            v-if="isLoading"
            :disabled="isLoading"
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

    <div v-if="posts.length > 0">
      <h2>Posts</h2>
      <PostList
        :posts="posts"
        :editable="isOwner"
        @save-post="editPost"
      />
    </div>

    <div v-if="drafts.length > 0">
      <h2>Drafts</h2>
      <PostList
        :posts="drafts"
        :editable="isOwner"
        @save-post="editPost"
        @publish-draft="publishDraft"
      />
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
