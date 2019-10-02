<script>
import formatDate from '@utils/format-date'

export default {
  props: {
    post: {
      type: Object,
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
  data() {
    return {
      title: this.post.title,
      text: this.post.text,
    }
  },
  methods: {
    formatDate(date) {
      return formatDate(date, 'MMM Do, YYYY - hh:mm a')
    },
  },
}
</script>

<template>
  <div data-test="postItem">
    <div :class="$style.postHeader">
      <input
        v-model="title"
        :class="[$style.postTitle, $style.indent]"
        :disabled="editable == false"
      />
      <div :class="$style.indent">
        <div v-if="showAuthor" :class="$style.authorText">
          By
          <BaseLink
            data-test="postAuthorLink"
            :params="{ id: post.author.id }"
            name="user-profile"
          >
            <a>{{ post.author.name || 'Anonymous' }}</a> </BaseLink
          >-
        </div>
        <div data-test="postUpdatedAt" :class="$style.authorText"
          >Last updated on {{ formatDate(post.updatedAt) }}</div
        >
      </div>
    </div>
    <div v-if="editable" :class="$style.center">
      <form>
        <textarea v-model="text" :class="$style.editArea" />
        <BaseButton
          v-if="post.editing"
          :disabled="post.editing"
          :class="$style.actionButton"
        >
          <BaseIcon name="sync" spin />
        </BaseButton>
        <div v-else>
          <BaseButton
            data-test="saveButton"
            :class="$style.actionButton"
            :disabled="text === post.text && title === post.title"
            @click.prevent="
              $emit('save-post', Object.assign({}, post, { title, text }))
            "
          >
            <span>Save</span>
          </BaseButton>
          <BaseButton
            v-if="!post.isPublished"
            :class="$style.actionButton"
            @click.prevent="$emit('publish-draft', post)"
          >
            <span>Publish</span>
          </BaseButton>
        </div>
      </form>
    </div>
    <div v-else :class="[$style.textContainer, $style.indent]">
      <p data-test="postText">{{ post.text }}</p>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

// General

.center {
  text-align: center;
}

.indent {
  text-indent: 2%;
}

.actionButton {
  width: 30%;
  margin: 10px 10px 10px auto;
}

// Post header

.postHeader {
  padding: 0.5em 0;
  text-align: left;
  background: #eee;
  border: $size-input-border solid $color-input-border;
}

.postTitle {
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 24px;
  background: transparent;
  border: none;
}

.authorText {
  display: inline;
  font-size: 70%;
}

// Post body

.textContainer {
  width: 100%;
  margin: auto;
  text-align: left;
  border: $size-input-border solid $color-input-border;
}

.editArea {
  width: 100%;
  height: 10em;
  min-height: 5em;
  max-height: 20em;
  padding: $size-input-padding-vertical $size-input-padding-horizontal;
  line-height: 1;
  vertical-align: top;
  resize: vertical;
  border: $size-input-border solid $color-input-border;
}
</style>
