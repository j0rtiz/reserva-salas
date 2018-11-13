<template>
  <q-page />
</template>

<script>
export default {
  name: 'Token',
  mounted () {
    this.$q.loading.show()
    this.Token()
  },
  methods: {
    Token () {
      this.$axios.defaults.headers.common['Authorization'] = this.$route.query['accessToken']
      this.$axios.get(`/usuarios/${this.$route.query['usuarioId']}`).then(Res => {
        Res.data.accessToken = this.$route.query['accessToken']
        this.$store.commit('session/set', Res.data)

        // Nível de permissão
        this.$acl.change('admin')
        // this.$acl.change('authenticated')

        this.$q.localStorage.set('AutoLogin', this.$route.query)
        this.$router.push(this.$q.localStorage.get.item('urlGoTo'))
      }).catch(Err => {
        this.$router.push('/login')
        let erro = Err.response.data.error.message.charAt(0).toUpperCase() + Err.response.data.error.message.substring(1)
        this.$q.notify({
          type: 'negative',
          timeout: 1000,
          message: erro
        })
      })
      this.$q.loading.hide()
    }
  }
}
</script>
