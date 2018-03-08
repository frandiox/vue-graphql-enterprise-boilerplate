<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import { GetNote, ListNotes, DeleteNote } from '@gql/note'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },

  data() {
    return {
      notes: [],
      selectedId: null,
      selectedNote: {},
    }
  },

  methods: {
    deleteNote(note) {
      this.$apollo.mutate({
        mutation: DeleteNote,
        variables: { id: note.id },
        update: (store, { data: { deleteNote } }) => {
          const data = store.readQuery({ query: ListNotes })
          data.listNotes.items = data.listNotes.items.filter(
            note => note.id !== deleteNote.id
          )
          store.writeQuery({ query: ListNotes, data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteNote: {
            __typename: 'Note',
            ...note,
          },
        },
      })
    },
  },

  apollo: {
    notes: {
      query: () => ListNotes,
      update: data => data.listNotes.items,
    },
    selectedNote: {
      query: () => GetNote,
      variables() {
        return {
          id: this.selectedId,
        }
      },
      update: data => data.getNote,
      skip() {
        return this.selectedId === null
      },
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <div>
        <h1>Home Page</h1>
        <img
          src="@assets/images/logo.png"
          alt="Logo"
        >
        <div
          v-if="notes.length > 0 && selectedId !== null"
          :class="$style.selected"
        >
          <pre>{{ selectedNote }}</pre>
        </div>
      </div>

      <div :class="$style.notes">
        Notes:
        <ul>
          <li
            v-for="note in notes"
            :key="note.id"
            :class="$style.note"
          >
            <span>{{ note.title }}</span>
            <BaseButton @click="selectedId = note.id">Inspect</BaseButton>
            <BaseButton @click="deleteNote(note)">Delete</BaseButton>
          </li>
        </ul>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '~@design';

.container {
  display: flex;
  justify-content: space-between;
}

.notes {
  width: 400px;
}

.note {
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  span {
    flex-grow: 1;
    width: 300px;
    margin-right: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.selected {
  width: 350px;
  overflow-x: scroll;
}
</style>
