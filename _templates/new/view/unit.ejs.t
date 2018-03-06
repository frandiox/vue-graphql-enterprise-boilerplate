---
to: "src/router/views/<%= h.inflection.dasherize(name) + (folder ? '/index' : '') %>.unit.js"
---
<%
  const fileName = h.inflection.dasherize(name)
  const importName = h.inflection.camelize(fileName.replace(/-/g, '_'))
%>import <%= importName %> from './<%= folder ? 'index' : fileName %>'

describe('@views/<%= fileName %>', () => {
  it('is a valid view', () => {
    expect(<%= importName %>).toBeAViewComponent()
  })
})
