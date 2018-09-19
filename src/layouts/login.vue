<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Login',
  mounted () {
    this.AutoLogin()
  },
  methods: {
    AutoLogin () {
      if (this.$q.localStorage.get.item('AutoLogin')) {
        this.$router.push({
          path: '/login/token',
          query: this.$q.localStorage.get.item('AutoLogin')
        })
      }
    }
  }
}
</script>
