---
to: "<%
  const d = h.inflection.dasherize;
  const path = view ? `router/views/${d(view)}/` : '';
  const base = (!view && d(name).toLowerCase().slice(0, 5) === 'base-') ? 'globals/_' : '';
%>src/<%= path %>components/<%= base %><%= folder ? (d(name) + '/index') : d(name) %>.unit.js"
---
<%
  const componentName = h.inflection.dasherize(name)
  const importName = h.inflection.camelize(componentName.replace(/-/g, '_'))
%>import <%= importName %> from './<%= folder ? 'index' : componentName %>'

describe('@components/<%= componentName %>', () => {
  it('exports a valid component', () => {
    expect(<%= importName %>).toBeAComponent()
  })
})
