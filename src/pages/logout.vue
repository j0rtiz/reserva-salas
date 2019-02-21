<template>
  <q-page />
</template>

<script>
export default {
  name: 'Logout',
  mounted () {
    this.Sair()
  },
  methods: {
    Sair () {
      this.$axios.post('/usuarios/logout').finally(() => {
        window.localStorage.clear()
        this.$store.commit('session/resetState')
        this.$acl.change('public')
        this.$router.push('/')
      })
    }
  }
}
</script>
