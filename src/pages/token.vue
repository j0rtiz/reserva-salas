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
      this.$q.loading.show()
      const query = this.$route.query
      const urlGoTo = this.$q.localStorage.get.item('urlGoTo') || '/'
      this.$axios.defaults.headers.common.Authorization = query.accessToken
      this.$axios.get(`/usuarios/${query.usuarioId}`).then(Res => {
        Res.data.accessToken = query.accessToken
        this.$q.localStorage.set('AutoLogin', query)
        this.$store.commit('session/set', Res.data)
        this.$acl.change(Res.data.acl)
        this.$router.push(urlGoTo)
      }).catch(() => {
        this.$router.push('/login')
      }).finally(() => {
        this.$q.loading.hide()
      })
    }
  }
}
</script>
