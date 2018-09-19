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
      this.$axios.post('/usuarios/logout').then(Res => {
        this.$store.commit('session/resetState')
        window.localStorage.clear()
        window.location = '/'
      }).catch(Err => {
        let erro = Err.response.data.error.message.charAt(0).toUpperCase() + Err.response.data.error.message.substring(1)
        this.$q.notify({
          type: 'negative',
          timeout: 1000,
          message: erro
        })
      })
    }
  }
}
</script>
