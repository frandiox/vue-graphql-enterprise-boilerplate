<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import { listTodos } from '@gql/queries/todo.gql'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },

  data() {
    return {
      todos: [],
    }
  },

  apollo: {
    todos: {
      query: () => listTodos,
      update(data) {
        console.log('data: ', data)
        return data.listTodos.items
      },
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.todos">
      <pre>{{ todos }}</pre>
    </div>

    <h1>Home Page</h1>
    <img
      src="@assets/images/logo.png"
      alt="Logo"
    >
  </Layout>
</template>

<style lang="scss" module>
@import '~@design';

.todos {
  float: right;
}
</style>
