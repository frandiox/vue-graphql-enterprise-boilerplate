---
to: "<%
  const d = h.inflection.dasherize;
  const path = view ? `router/views/${d(view)}/` : '';
  const base = (!view && d(name).toLowerCase().slice(0, 5) === 'base-') ? 'globals/_' : '';
%>src/<%= path %>components/<%= base %><%= folder ? (d(name) + '/index') : d(name) %>.unit.js"
---
<%
  const fileName =
    (h.inflection.dasherize(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '') +
    h.inflection.dasherize(name)
  const importName = h.inflection.camelize(fileName.replace(/-/g, '_'))
%>import <%= importName %> from '<%= folder ? '.' : `./${fileName}` %>'

describe('@components/<%= fileName %>', () => {
  it('exports a valid component', () => {
    expect(<%= importName %>).toBeAComponent()
  })
})
