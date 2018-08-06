<template>
  <q-page/>
</template>

<script>
export default {
  name: 'PageToken',
  mounted () {
    this.$q.loading.show({
      message: 'Iniciando sessão...'
    })

    //  Valida se o Usuário/Token está correto
    this.$axios.defaults.headers.common['Authorization'] = this.$route.query['accessToken']
    this.$axios.get('/Usuarios/' + this.$route.query['usuarioId']).then(Res => {
      Res.data.accessToken = this.$route.query['accessToken']
      this.$store.commit('session/set', Res.data)

      //  Define a permissão de acesso do usuário
      this.$acl.change('admin')

      //  Armazena o token
      this.$q.loading.hide()
      this.$q.localStorage.set('AutoLogin', this.$route.query)
      this.$router.push('/')
    }).catch(Err => {
      switch (Err.response.data.error.code) {
        case 'LOGIN_FAILED': this.$router.push('/login/')
          break
        case 'AUTHORIZATION_REQUIRED': this.$router.push('/login/')
          break
        default: this.$q.notify(Err.response.data.error.code)
          break
      }
    })
  }
}
</script>
