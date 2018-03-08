---
to: "<%
  const path = view ? `router/views/${h.inflection.dasherize(view)}/` : '';
%>src/<%= path %>gql/<%= h.inflection.dasherize(name) %>.gql"
---
<%
  const camelName = h.inflection.camelize(name)
  const camelPluralName = h.inflection.camelize(h.inflection.pluralize(name))
%>### Queries

query List<%= camelPluralName %> {
  list<%= camelPluralName %> {
    items {
      id
    }
  }
}

query Get<%= camelName %>($id: ID!) {
  get<%= camelName %>(id: $id) {
    id
  }
}

### Mutations

mutation Create<%= camelName %>($id: ID!) {
  create<%= camelName %>(input: { id: $id }) {
    id
  }
}

mutation Update<%= camelName %>($id: ID!) {
  update<%= camelName %>(input: { id: $id }) {
    id
  }
}

mutation Delete<%= camelName %>($id: ID!) {
  delete<%= camelName %>(input: { id: $id }) {
    id
  }
}
