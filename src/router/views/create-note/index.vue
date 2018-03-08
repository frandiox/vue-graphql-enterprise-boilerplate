<script>
import Layout from '@layouts/main'
import uuidV4 from 'uuid/v4'
import { ListNotes, CreateNote } from '@gql/note'

export default {
  page: {
    title: 'CreateNote',
    meta: [{ name: 'description', content: 'CreateNote' }],
  },
  components: { Layout },

  data() {
    return {
      title: '',
      description: '',
      createNoteError: null,
      loading: 0,
    }
  },

  methods: {
    createNote() {
      if (!this.title) {
        return
      }

      const note = {
        id: uuidV4(),
        title: this.title,
        description: this.description,
      }

      this.$apollo
        .mutate({
          mutation: CreateNote,
          variables: note,
          loadingKey: 'loading',
          update: (store, { data: { createNote } }) => {
            const data = store.readQuery({ query: ListNotes })
            data.listNotes.items.push(createNote)
            store.writeQuery({ query: ListNotes, data })
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createNote: {
              __typename: 'Note',
              ...note,
            },
          },
        })
        .then(() => {
          this.title = ''
          this.description = ''
        })
        .catch(error => {
          console.error(error)
          this.createNoteError = error
        })
    },
  },
}
</script>

<template>
  <Layout>
    <form
      :class="$style.form"
      @submit.prevent="createNote"
    >
      <span>Note title</span>
      <BaseInput
        v-model="title"
        name="title"
      />
      <span>Note description</span>
      <BaseInput
        v-model="description"
        name="description"
      />
      <BaseButton
        type="submit"
        :disabled="!!loading"
      >
        <BaseIcon
          v-if="!!loading"
          source="custom"
          name="loading"
        />
        <span v-else>Create Note</span>
      </BaseButton>
      <p v-if="createNoteError">
        There was an error logging in to your account.
      </p>
    </form>
  </Layout>
</template>

<style lang="scss" module>
@import '~@design';

.form {
  text-align: center;
}
</style>
