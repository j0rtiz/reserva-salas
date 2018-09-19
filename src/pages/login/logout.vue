<template>
  <q-page/>
</template>

<script>
import { AxiosCatchMixin } from '../../mixins/AxiosCatch'
export default {
  name: 'PageLogout',
  mixins: [AxiosCatchMixin],
  mounted () {
    this.$axios.post('/Usuarios/logout').then(Res => {
      this.$store.commit('session/resetState')
      window.localStorage.clear()
      window.location = '/'
    }).catch(this.AxiosCatch)
  }
}
</script>
