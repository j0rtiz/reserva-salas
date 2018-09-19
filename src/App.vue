<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.App()
  },
  methods: {
    App () {
      this.$q.localStorage.set('urlGoTo', `${window.location.pathname}${window.location.search}`)
      if (window.location.pathname === '/login') {
        this.$q.localStorage.set('urlGoTo', '/')
      }
    }
  }
}
</script>
