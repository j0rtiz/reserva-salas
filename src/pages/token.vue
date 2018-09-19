<template>
  <q-page />
</template>

<script>
export default {
  name: 'Token',
  mounted () {
    this.Token()
  },
  methods: {
    Token () {
      this.$q.loading.show({
        message: 'Iniciando sessão...'
      })
      this.$axios.defaults.headers.common['Authorization'] = this.$route.query['accessToken']
      this.$axios.get(`/usuarios/${this.$route.query['usuarioId']}`).then(Res => {
        Res.data.accessToken = this.$route.query['accessToken']
        this.$store.commit('session/set', Res.data)

        // Nível de permissão
        this.$acl.change('admin')
        // this.$acl.change('authenticated')

        this.$q.loading.hide()
        this.$q.localStorage.set('AutoLogin', this.$route.query)
        this.$router.push(this.$q.localStorage.get.item('urlGoTo'))
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
