---
to: "<%
  const d = h.inflection.dasherize;
  const path = view ? `router/views/${d(view)}/` : '';
  const base = (!view && d(name).toLowerCase().slice(0, 5) === 'base-') ? 'globals/_' : '';
%>src/<%= path %>components/<%= base %><%= folder ? (d(name) + '/index') : d(name) %>.vue"
---
<%
if (blocks.indexOf('script') !== -1) {
%><script>
export default {
  <% if (blocks.indexOf('template') === -1) {
  %>render(h) {
    return <div/>
  }<% } %>
}
</script>
<%
}

if (blocks.indexOf('template') !== -1) {
%>
<template>
  <div/>
</template>
<%
}

if (blocks.indexOf('style') !== -1) {
%>
<style lang="scss" module>
@import '~@design';
</style><%
}
%>
